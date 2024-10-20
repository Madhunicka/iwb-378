

import React, { useState } from "react";
import { FaInfoCircle, FaClipboardList, FaNetworkWired, FaPlay, FaStop, FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const DeveloperTool = () => {

    const [activeTab, setActiveTab] = useState("Info");
    const [toggle, setToggle] = useState(false);

    
    const location = useLocation();
    const { bugId } = location.state || {};
    console.log("first", bugId)

    
    const sessionInfo = {
        platform: "Windows NT 10.0",
        browser: "Chrome 123.0.6658.30",
        engine: "Blink",
        screen: "1536 x 864",
        windowSize: "1536 x 695",
        type: "desktop",
        vendor: "Google",
        location: "GB",
        timezone: "Asia/Colombo",
        downloadSpeed: 8.17,
        latency: "200ms",
    };

    const logs = [
        { time: "00:00", text: "Session Started: Page loaded at http://localhost:3000/", icon: <FaPlay className="text-green-500" /> },
        { time: "00:01", text: "Screen Recording Start: Recording initiated", icon: <FaPlay className="text-blue-500" /> },
        { time: "00:05", text: "Click Event: Clicked 'View' button (status: 500 - internal server error)", icon: <FaTimesCircle className="text-red-500" /> },
        { time: "00:07", text: "API Request: Sent FetchUser request (status: 200 OK)", icon: <FaCheckCircle className="text-green-500" /> },
        { time: "00:08", text: "Click Event: Clicked 'Profile' link (status: 500 internal error)", icon: <FaTimesCircle className="text-red-500" /> },
        { time: "00:10", text: "API Request: Fetched user profile (status: 200 OK)", icon: <FaCheckCircle className="text-green-500" /> },
        { time: "00:11", text: "Screen Recording End: Recording stopped", icon: <FaStop className="text-blue-500" /> },
        { time: "00:11", text: "Session Ended: Session closed", icon: <FaStop className="text-red-500" /> },
    ];

    const network = [
        { time: "00:00", text: "GET /bundle.js - Status: 200 OK", icon: <FaArrowRight className="text-green-500" /> },
        { time: "00:01", text: "GET /assets/main.bundle.js - Status: 200 OK", icon: <FaArrowRight className="text-green-500" /> },
        { time: "00:02", text: "GET /favicon.ico - Status: 200 OK", icon: <FaArrowRight className="text-green-500" /> },
        { time: "00:05", text: "GET /api/user - Status: 500 Internal Server Error", icon: <FaTimesCircle className="text-red-500" /> },
        { time: "00:07", text: "GET /api/profile - Status: 200 OK", icon: <FaArrowRight className="text-green-500" /> },
        { time: "00:10", text: "GET /styles.css - Status: 200 OK", icon: <FaArrowRight className="text-green-500" /> },
        { time: "00:11", text: "GET /callback - Status: 200 OK", icon: <FaArrowRight className="text-green-500" /> },
    ];

    // State for comments
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");

    const handleCommentChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentInput.trim()) {
            const newComment = {
                text: commentInput,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setComments([...comments, newComment]);
            setCommentInput("");
        }
    };

    const handleToggleChange = () => {
        setToggle(!toggle);
    }
    const users = [
        { id: 'john-doe', name: 'John Doe' },
        { id: 'jane-doe', name: 'Jane Doe' },
        { id: 'mark-smith', name: 'Mark Smith' },
    ];

    // Sample priority options
    const priorityOptions = [
        { id: 'high', label: 'High' },
        { id: 'medium', label: 'Medium' },
        { id: 'low', label: 'Low' },
    ];

    // State for selected user and priority
    const [selectedUser, setSelectedUser] = React.useState(users[0].id);
    const [selectedPriority, setSelectedPriority] = React.useState(priorityOptions[0].id);

    // Function to handle user selection
    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    // Function to handle priority selection
    const handlePriorityChange = (event) => {
        setSelectedPriority(event.target.value);
    };


    const renderTabContent = () => {
        switch (activeTab) {
            case "Info":
                return (
                    <div className="text-gray-700">
                        <p className="mb-2"><strong>Platform:</strong> {sessionInfo.platform}</p>
                        <p className="mb-2"><strong>Browser:</strong> {sessionInfo.browser}</p>
                        <p className="mb-2"><strong>Engine:</strong> {sessionInfo.engine}</p>
                        <p className="mb-2"><strong>Screen:</strong> {sessionInfo.screen}</p>
                        <p className="mb-2"><strong>Window:</strong> {sessionInfo.windowSize}</p>
                        <p className="mb-2"><strong>Type:</strong> {sessionInfo.type}</p>
                        <p className="mb-2"><strong>Vendor:</strong> {sessionInfo.vendor}</p>
                        <p className="mb-2"><strong>Timezone:</strong> {sessionInfo.timezone}</p>
                        <h3 className="font-bold mt-4 text-lg">Internet Connection</h3>
                        <p className="mb-2"><strong>Download Speed:</strong> {sessionInfo.downloadSpeed} Mbps</p>
                        <p className="mb-2"><strong>Latency:</strong> {sessionInfo.latency}</p>
                    </div>

                );
            case "Logs":
                return (
                    <ul className="list-none">
                        {logs.map((log, index) => (
                            <li key={index} className="flex items-center mb-2">
                                <span className="mr-2">{log.icon}</span>
                                <span className="text-gray-600">{log.time} - {log.text}</span>
                            </li>
                        ))}
                    </ul>
                );
            case "Network":
                return (
                    <ul className="list-none">
                        {network.map((net, index) => (
                            <li key={index} className="flex items-center mb-2">
                                <span className="mr-2">{net.icon}</span>
                                <span className="text-gray-600">{net.time} - {net.text}</span>
                            </li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Header Section */}
            <header className="bg-gray-900 text-white p-4 shadow-lg fixed top-0 z-10 w-full">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold">Developer Tool</h1>
                    </div>
                </div>
            </header>

            <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6  py-12">
                <div className={`grid grid-cols-12 gap-6`}>
                    {/* Left Section*/}
                    <div className={`col-span-4 bg-gray-50 p-4 rounded-lg shadow-md overflow-y-auto`}>

                        <div className="mb-4">
                            <button
                                className={`mr-2 px-4 py-2 ${activeTab === "Info" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-lg`}
                                onClick={() => setActiveTab("Info")}
                            >
                                <FaInfoCircle className="inline-block mr-2" /> Info
                            </button>
                            <button
                                className={`mr-2 px-4 py-2 ${activeTab === "Logs" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-lg`}
                                onClick={() => setActiveTab("Logs")}
                            >
                                <FaClipboardList className="inline-block mr-2" /> Logs
                            </button>
                            <button
                                className={`mr-2 px-4 py-2 ${activeTab === "Network" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-lg`}
                                onClick={() => setActiveTab("Network")}
                            >
                                <FaNetworkWired className="inline-block mr-2" /> Network
                            </button>
                        </div>


                        <div>{renderTabContent()}</div>
                    </div>

                    {/* Middle Section */}
                    <div className={`${toggle ? "col-span-7" : "col-span-6"} bg-gray-50 p-4 rounded-lg shadow-md overflow-y-auto`}>
                        <img
                            className="w-full rounded-lg border"
                            src="https://mydukaan.io/blog/wp-content/uploads/online-saree-business-on-Dukaan-1024x573.png"
                            alt="Bug screenshot"
                        />
                        <h2 className="font-bold text-lg mb-4 text-gray-700">Bug Tracked</h2>
                        <p className="font-semibold text-gray-700">
                            Hi Team, Look into Data fetched error while clicking button
                        </p>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-800">Comments:</p>
                            <ul className="list-disc list-inside">
                                {comments.map((comment, index) => (
                                    <li key={index} className="text-gray-600">
                                        <strong>{comment.time}:</strong> {comment.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <form onSubmit={handleCommentSubmit} className="mt-4">
                            <textarea
                                value={commentInput}
                                onChange={handleCommentChange}
                                rows="3"
                                placeholder="Add a comment..."
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                            <button
                                type="submit"
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Add Comment
                            </button>
                        </form>
                    </div>

                    {/* Right Section */}
                    {!toggle ?
                        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md overflow-y-auto border border-gray-200">
                            <div className="flex justify-between">
                                <h2 className="font-bold text-xl mb-4 text-gray-800">Details</h2>
                                <IoChevronForward onClick={handleToggleChange} />
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-700 font-semibold">Date:</p>
                                <p className="text-gray-600">5 Oct 2024, 12:04 AM Asia/Colombo</p>
                            </div>


                            <div className="mb-4">
                                <p className="text-gray-700 font-semibold">Created by:</p>
                                <p className="text-gray-600">
                                    <a href="https://example.com/profile/sivasothy" className="text-blue-600 hover:underline">Sivasothy Tharsi</a>
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-700 font-semibold">URL:</p>
                                <p className="text-gray-600">
                                    <a href="https://localhost:3000/" className="text-blue-600 hover:underline">https://localhost:3000/</a>
                                </p>
                            </div>


                            <div className="mb-4">
                                <p className="text-gray-700 font-semibold">Assigned to:</p>
                                <div className="flex items-center">
                                    <select
                                        value={selectedUser}
                                        onChange={handleUserChange}
                                        className="border border-gray-300 rounded-lg p-1 focus:outline-none focus:border-blue-500"
                                    >
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-700 font-semibold">Priority:</p>
                                <div className="flex items-center">
                                    <select
                                        value={selectedPriority}
                                        onChange={handlePriorityChange}
                                        className="border border-gray-300 rounded-lg p-1 focus:outline-none focus:border-blue-500"
                                    >
                                        {priorityOptions.map((priority) => (
                                            <option key={priority.id} value={priority.id}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <div>
                                <p className="text-gray-700 font-semibold">Status:</p>
                                <p className="text-gray-600">
                                    <span className="font-semibold text-yellow-600">In Progress</span>
                                </p>
                            </div>
                        </div> :
                        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto border border-gray-200">
                            <IoChevronBackOutline onClick={handleToggleChange} />
                        </div>
                    }


                </div>
            </div>
        </div>
    );
};

export default DeveloperTool;
