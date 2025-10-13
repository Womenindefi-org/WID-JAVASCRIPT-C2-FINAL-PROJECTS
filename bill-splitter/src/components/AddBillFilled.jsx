import React from "react";

const AddBillFilled = ({ bill, onNext }) => {
  return (
    <div className="p-6">
      <h1 className="text-center text-lg font-semibold">Add New Bill</h1>

      <div className="mt-6">
        <label className="text-gray-400 text-sm">Description</label>
        <input
          type="text"
          value={bill.description}
          className="w-full mt-1 p-3 rounded-md bg-gray-800 text-white"
          readOnly
        />
      </div>

      <div className="mt-6">
        <label className="text-gray-400 text-sm">Total Amount</label>
        <input
          type="number"
          value={bill.amount}
          className="w-full mt-1 p-3 rounded-md bg-gray-800 text-white"
          readOnly
        />
      </div>

      <div className="mt-6">
        <label className="text-gray-400 text-sm">Select Group</label>
        <input
          type="text"
          value={bill.group}
          className="w-full mt-1 p-3 rounded-md bg-gray-800 text-white"
          readOnly
        />
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full bg-purple-600 py-3 rounded-lg font-medium"
      >
        Proceed to Split
      </button>
    </div>
  );
};

export default AddBillFilled;
