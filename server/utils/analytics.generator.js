export async function generateLast12MonthsData(userId, model) {
  const last12Months = [];

  const currDate = new Date();
  currDate.setDate(currDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate() - i * 28
    );
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
      user: userId,
    });

    last12Months.push({ month: monthYear, count });
  }
  return { last12Months };
}
