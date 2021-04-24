export function convertDurationToTimeString(duration: number) : String{
    
    const hours = Math.floor( duration/3600);
    const min = Math.floor( (duration%3600)/60);
    const seconds = Math.floor( duration%60);

    const timeString = [hours,min, seconds]
        .map(unit => String(unit).padStart(2,'0'))
        .join(':');
    
    return timeString;
}