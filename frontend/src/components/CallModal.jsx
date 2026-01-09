import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiPhone, FiX, FiClock, FiCheckCircle } from 'react-icons/fi';

const CallModal = ({ lead, onClose, onComplete }) => {
    const [callId, setCallId] = useState(null);
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, active, ending
    const [duration, setDuration] = useState(0);
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [scheduleFollowup, setScheduleFollowup] = useState(false);
    const [followupDate, setFollowupDate] = useState('');
    const [followupNotes, setFollowupNotes] = useState('');

    useEffect(() => {
        let interval;
        if (callStatus === 'active') {
            interval = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartCall = async () => {
        try {
            setCallStatus('calling');

            // Simulate dialing delay
            setTimeout(async () => {
                const response = await api.post('/calls/start', { lead_id: lead.id });
                setCallId(response.data.call.id);
                setCallStatus('active');
            }, 2000);
        } catch (error) {
            console.error('Error starting call:', error);
            alert('Failed to start call');
            setCallStatus('idle');
        }
    };

    const handleEndCall = async () => {
        if (!outcome) {
            alert('Please select a call outcome');
            return;
        }

        try {
            setCallStatus('ending');
            await api.patch(`/calls/${callId}/end`, { outcome, notes });

            // Create follow-up if scheduled
            if (scheduleFollowup && followupDate) {
                await api.post('/followups', {
                    lead_id: lead.id,
                    call_id: callId,
                    scheduled_date: followupDate,
                    notes: followupNotes,
                });
            }

            onComplete();
        } catch (error) {
            console.error('Error ending call:', error);
            alert('Failed to end call');
            setCallStatus('active');
        }
    };

    const outcomes = [
        { value: 'no_answer', label: 'No Answer', color: 'gray' },
        { value: 'busy', label: 'Busy', color: 'yellow' },
        { value: 'voicemail', label: 'Voicemail', color: 'blue' },
        { value: 'connected', label: 'Connected', color: 'green' },
        { value: 'interested', label: 'Interested', color: 'green' },
        { value: 'not_interested', label: 'Not Interested', color: 'red' },
        { value: 'callback', label: 'Callback Requested', color: 'orange' },
        { value: 'converted', label: 'Converted', color: 'green' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-t-2xl text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold">{lead.company_name}</h3>
                            <p className="text-primary-100 mt-1">{lead.contact_person}</p>
                            <p className="text-primary-200 text-lg font-semibold mt-2">{lead.phone}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
                            disabled={callStatus === 'active'}
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Call Status */}
                    <div className="text-center">
                        {callStatus === 'idle' && (
                            <button
                                onClick={handleStartCall}
                                className="btn btn-success btn-lg w-full sm:w-auto px-12"
                            >
                                <FiPhone className="w-6 h-6 mr-2" />
                                Start Call
                            </button>
                        )}

                        {callStatus === 'calling' && (
                            <div className="space-y-4">
                                <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center animate-pulse-slow">
                                    <FiPhone className="w-10 h-10 text-primary-600 animate-pulse" />
                                </div>
                                <p className="text-lg font-medium text-gray-700">Calling...</p>
                            </div>
                        )}

                        {callStatus === 'active' && (
                            <div className="space-y-4">
                                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                    <FiPhone className="w-12 h-12 text-green-600" />
                                </div>
                                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-gray-900">
                                    <FiClock className="w-8 h-8 text-primary-600" />
                                    {formatDuration(duration)}
                                </div>
                                <p className="text-lg font-medium text-green-600">Call in Progress</p>
                            </div>
                        )}
                    </div>

                    {/* Call Outcome (shown during active call) */}
                    {callStatus === 'active' && (
                        <>
                            <div>
                                <label className="label">Call Outcome *</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {outcomes.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setOutcome(opt.value)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${outcome === opt.value
                                                    ? 'bg-primary-600 text-white ring-2 ring-primary-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">Call Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="input"
                                    rows="3"
                                    placeholder="Add notes about this call..."
                                />
                            </div>

                            {/* Schedule Follow-up */}
                            <div className="border-t pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={scheduleFollowup}
                                        onChange={(e) => setScheduleFollowup(e.target.checked)}
                                        className="w-4 h-4 text-primary-600 rounded"
                                    />
                                    <span className="font-medium text-gray-700">Schedule Follow-up</span>
                                </label>

                                {scheduleFollowup && (
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label className="label">Follow-up Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                value={followupDate}
                                                onChange={(e) => setFollowupDate(e.target.value)}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Follow-up Notes</label>
                                            <input
                                                type="text"
                                                value={followupNotes}
                                                onChange={(e) => setFollowupNotes(e.target.value)}
                                                className="input"
                                                placeholder="What to discuss in follow-up..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* End Call Button */}
                            <button
                                onClick={handleEndCall}
                                disabled={callStatus === 'ending'}
                                className="btn btn-danger w-full btn-lg"
                            >
                                {callStatus === 'ending' ? 'Ending Call...' : 'End Call'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallModal;
