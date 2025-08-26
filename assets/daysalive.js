// Calculate days since 6:00 AM, September 13, 2010
function updateDaysAlive() {
    // Create the start date: September 13, 2010 at 6:00 AM
    const startDate = new Date(2010, 8, 13, 6, 0, 0); // Month is 0-indexed, so 8 = September
    
    // Get the current date and time
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const timeDifference = currentDate - startDate;
    
    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysAlive = Math.floor(timeDifference / millisecondsPerDay);
    
    // Find the span element and update its content
    const spanElement = document.getElementById('daysalive');
    if (spanElement) {
        spanElement.textContent = daysAlive.toLocaleString();
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', updateDaysAlive);

// Optional: Update every minute to keep it current
setInterval(updateDaysAlive, 60000);