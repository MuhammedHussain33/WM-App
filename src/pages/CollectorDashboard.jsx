    import React, { useEffect, useState } from "react";

    const CollectorDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [collector, setCollector] = useState(null);

    useEffect(() => {
        const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];
        const loggedInUser = JSON.parse(localStorage.getItem("ecoWasteUser"));
        setCollector(loggedInUser);

        const assigned = allRequests.filter(
        (r) => r.assignedTo === loggedInUser?.email
        );
        setRequests(assigned);
    }, []);

    const updateStatus = (requestId, newStatus) => {
        const updatedRequests = JSON.parse(localStorage.getItem("pickupRequests")).map((r) =>
        r.id === requestId ? { ...r, status: newStatus } : r
        );
        localStorage.setItem("pickupRequests", JSON.stringify(updatedRequests));
        setRequests(updatedRequests.filter((r) => r.assignedTo === collector.email));
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Collector Dashboard</h2>

        {requests.length === 0 ? (
            <p className="text-gray-600">No assigned pickups yet.</p>
        ) : (
            <div className="grid gap-6">
            {requests.map((req) => (
                <div
                key={req.id}
                className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500"
                >
                <h4 className="text-lg font-semibold">{req.name}</h4>
                <p className="text-sm text-gray-600">{req.address}</p>
                <p className="text-sm text-gray-600">Date: {req.date}</p>
                <p className="text-sm text-gray-600">Waste Type: {req.type}</p>
                <p className="text-sm">
                    Status:{" "}
                    <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                        req.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : req.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    >
                    {req.status}
                    </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {req.status !== "Completed" && (
                    <>
                        <button
                        onClick={() => updateStatus(req.id, "In Progress")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                        Mark In Progress
                        </button>
                        <button
                        onClick={() => updateStatus(req.id, "Completed")}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                        Mark Completed
                        </button>
                    </>
                    )}
                    <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        req.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                    View Map
                    </a>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
    };

    export default CollectorDashboard;
