app.post("/api/insights", (req, res) => {
  const { query } = req.body;

  // For now, mock AI response
  let answer = "I’m still learning. But here’s a tip: track your biggest spending categories weekly.";
  
  if (query.toLowerCase().includes("food")) {
    answer = "You’ve spent ₦25,000 on food this month. That’s 30% of your total expenses.";
  }
  if (query.toLowerCase().includes("transport")) {
    answer = "Transport took ₦10,000 this month — about 12% of your budget.";
  }

  res.json({ answer });
});