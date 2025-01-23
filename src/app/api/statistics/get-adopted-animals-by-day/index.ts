// import { NextResponse } from "next/server";
// import StatisticModel from "@/entities/statistic/model/model"; // Adjust the path to your model

// // Helper function to generate the date range
// const getDateRange = (days: number): string[] => {
//   const today = new Date();
//   const dateRange: string[] = [];

//   // Iterate backward for 'days' number of days
//   for (let i = 0; i < days; i++) {
//     const date = new Date(today);
//     date.setDate(today.getDate() - i);
//     const formattedDate = date.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
//     dateRange.push(formattedDate);
//   }
//   return dateRange;
// };

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const days = Number(url.searchParams.get("days")) || 10; // Default to 10 days if not provided

//     // Get the date range for the last 'days' number of days
//     const dateRange = getDateRange(days);

//     // Fetch the adoption data for the last 'days' days
//     const statistic = await StatisticModel.findOne({}, { "animal.adoptedByDay": 1 }).lean();

//     if (!statistic) {
//       return NextResponse.json({ message: "No adoption data available" }, { status: 404 });
//     }

//     // Prepare the result data
//     const result = dateRange.map((date) => {
//       const adoptedData = statistic.animal.adoptedByDay[date];
//       return {
//         date,
//         adopted: adoptedData ? adoptedData.length : 0, // If no adoption data, return 0
//       };
//     });

//     return NextResponse.json({ data: result }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching adoption data:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
