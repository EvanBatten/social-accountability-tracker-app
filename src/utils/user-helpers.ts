// Get display name for a user ID
export function getUserDisplayName(userId: string, currentUser: any): string {
  // If it's the current user, show their name
  if (currentUser?.id === userId) {
    return currentUser.firstName && currentUser.lastName 
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName || currentUser.emailAddresses[0]?.emailAddress || "You";
  }
  
  // For other users, show a shortened version of their ID or "Anonymous User"
  // In a real app, you'd fetch user profiles from your database
  return "Anonymous User";
}

// Get initials for avatar fallback
export function getUserInitials(userId: string, currentUser: any): string {
  if (currentUser?.id === userId) {
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
    }
    if (currentUser.firstName) {
      return currentUser.firstName[0].toUpperCase();
    }
    if (currentUser.emailAddresses[0]?.emailAddress) {
      return currentUser.emailAddresses[0].emailAddress[0].toUpperCase();
    }
  }
  
  // For other users, use first letter of their ID
  return userId[0].toUpperCase();
} 