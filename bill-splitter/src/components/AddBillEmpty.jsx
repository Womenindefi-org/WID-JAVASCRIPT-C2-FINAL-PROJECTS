import React, { useState } from "react";

const AddBillEmpty = ({ bill, setBill, onNext, groups }) => {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!bill.description || !bill.amount || !bill.group) {
      setError("All fields are required.");
      return;
    }
    if (bill.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    setError("");
    onNext();
  };

  const isDisabled = !bill.description || !bill.amount || !bill.group;

  return (
    <div className="p-6">
      <h1 className="text-center text-lg font-semibold">Add New Bill</h1>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-6">
        <label className="text-gray-400 text-sm">Description</label>
        <input
          type="text"
          placeholder="What was this for?"
          value={bill.description}
          onChange={(e) => setBill({ ...bill, description: e.target.value })}
          className="w-full mt-1 p-3 rounded-md bg-gray-800 text-white"
        />
      </div>

      <div className="mt-6">
        <label className="text-gray-400 text-sm">Total Amount</label>
        <input
          type="number"
          placeholder="$ 0.00"
          value={bill.amount}
          onChange={(e) => setBill({ ...bill, amount: e.target.value })}
          className="w-full mt-1 p-3 rounded-md bg-gray-800 text-white"
        />
      </div>

      <div className="mt-6">
        <label className="text-gray-400 text-sm">Select Group</label>
        <select
          value={bill.group}
          onChange={(e) => setBill({ ...bill, group: e.target.value })}
          className="w-full mt-1 p-3 rounded-md bg-gray-800 text-white"
        >
          <option value="">-- Select a Group --</option>
          {groups.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNext}
        disabled={isDisabled}
        className={`mt-8 w-full py-3 rounded-lg font-medium ${
          isDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600"
        }`}
      >
        Next →
      </button>
    </div>
  );
};

export default AddBillEmpty;