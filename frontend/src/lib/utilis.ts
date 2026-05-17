// export const getDifficultyBadgeClass = (difficulty : any) => {
//   switch (difficulty.toLowerCase()) {
//     case "easy":
//       return "badge-success";
//     case "medium":
//       return "badge-warning";
//     case "hard":
//       return "badge-error";
//     default:
//       return "badge-ghost";
//   }
// };

export const getDifficultyBadgeClass = (difficulty: any) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800 py-0 px-2 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-800 py-0 px-2 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
    case "hard":
      return "bg-red-100 text-red-800 py-0 px-2 border border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-800 py-0 px-2 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";
  }
};