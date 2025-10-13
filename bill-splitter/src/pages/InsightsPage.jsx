import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";

export default function InsightsPage() {
  const { groups } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const transactions = useMemo(() => {
    return groups.flatMap(group =>
      group.expenses.map(expense => ({
        ...expense,
        groupName: group.name,
        category: group.category,
      }))
    );
  }, [groups]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    const userInput = input.toLowerCase();
    setInput("");

    let reply = "";

    if (transactions.length === 0) {
      reply = "You haven’t made any transactions yet. Add some spending and I’ll give you insights.";
    } else {
      const totalSpending = transactions.reduce((sum, tx) => sum + parseFloat(tx.totalAmount), 0);
      const transactionCount = transactions.length;

      if (userInput.includes("hello") || userInput.includes("hi")) {
        reply = "Hello! How can I help you with your spending insights today?";
      } else if (userInput.includes("how many") || userInput.includes("count")) {
        reply = `You have a total of ${transactionCount} transaction(s) recorded.`;
      } else if (userInput.includes("highest") || userInput.includes("most expensive")) {
        const highestTx = [...transactions].sort((a, b) => b.totalAmount - a.totalAmount)[0];
        reply = `Your most expensive transaction was for "${highestTx.description}" in the "${highestTx.groupName}" group, costing $${parseFloat(highestTx.totalAmount).toFixed(2)}.`;
      } else if (userInput.includes("lowest") || userInput.includes("cheapest")) {
        const lowestTx = [...transactions].sort((a, b) => a.totalAmount - b.totalAmount)[0];
        reply = `Your least expensive transaction was for "${lowestTx.description}" in the "${lowestTx.groupName}" group, costing $${parseFloat(lowestTx.totalAmount).toFixed(2)}.`;
      } else if (userInput.includes("breakdown") && userInput.includes("group")) {
        const spendingByGroup = transactions.reduce((acc, tx) => {
          acc[tx.groupName] = (acc[tx.groupName] || 0) + parseFloat(tx.totalAmount);
          return acc;
        }, {});
        reply = "Here is your spending breakdown by group:\n" + 
                Object.entries(spendingByGroup).map(([name, amount]) => `- ${name}: $${amount.toFixed(2)}`).join("\n");
      } else if (userInput.includes("breakdown") && userInput.includes("category")) {
        const spendingByCategory = transactions.reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + parseFloat(tx.totalAmount);
          return acc;
        }, {});
        reply = "Here is your spending breakdown by category:\n" + 
                Object.entries(spendingByCategory).map(([name, amount]) => `- ${name}: $${amount.toFixed(2)}`).join("\n");
      } else {
        reply = `I've analyzed your ${transactionCount} transaction(s). Your total spending is $${totalSpending.toFixed(2)}. You can ask for a "breakdown by group" or ask about your "highest" transaction.`;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 500);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">AI Insights</h1>
        <button
          onClick={clearChat}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm font-semibold"
        >
          Clear Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-lg w-fit whitespace-pre-wrap ${
              msg.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400 text-center">
              Ask me questions about your spending...
              <br />
              (e.g., "What is the breakdown by group?")
            </p>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="pt-4 flex gap-2 border-t border-gray-700">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg bg-input-bg text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about your spending..."
        />
        <button
          type="submit"
          className="bg-purple-600 px-4 py-2 rounded-lg font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
}