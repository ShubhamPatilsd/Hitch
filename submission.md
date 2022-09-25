## Inspiration

Whether it be vacation, visiting family, or work, many people often travel for long hours in their cars, alone. The radio quickly gets boring and traveling gets very boring and mundane for these folks. This is where I got the idea for Hitch: a way for drivers to have a buddy on their trips to prevent loneliness.

## What it does

Hitch automatically pairs you with a rider buddy who can hop in your car and give you company for those long hours on the roads. It scans a five mile radius from your starting location so you can quickly pick up these "hitchhikers" so you can continue on with your journey. Drivers can then contact these hitchhikers by email, instantly connecting them so they can coordinate together.

## How we built it
Hitch was built with technologies like Next.js and TailwindCSS. I broke the task down into many smaller parts and organized everything in a todo list to keep track of what to do. I used Yarn as my package manager to manage all my depencies, and used Typescript not have any breaking runtime errors.

## Challenges we ran into

1. Soloing it
 
 a. I decided to go solo into the hackathon, which meant that I wasn't progressing as fast as others teams would have.
 
2. Mapbox
    
    a. Mapbox (a library that helps with maps) just wouldn't cooperate with Next.js at all. I kept running into hydration errors, SSR problems, and Mapbox just not cooperating on the client side. This took hours to solve and was really draining on my productivity. 
    
    b. One such problem was that the Mapbox directions API NEVER wanted to work with Next.js. To get around this problem, I had to find the coordinates (latitude and longitude) of the destination, pipe that data into another API that took two points and mapped the route between them and outputted something called GeoJSON, and then overlay that on top of Mapbox, all just to get map working. This was overly frustrating and I hope in the future that geographical libraries get much easier to work with. Even then, some libraries used the order of `[latitude, longitude]` while some used `[longitude, latitude]`? What? These libraries also have some sorta bad documentation half the time, and really specific use-cases are often left behind while writing this documentation.

## Accomplishments that we're proud of

1. Creating a simple yet elegant UI
2. Figuring out how to use Mapbox and displaying the route from destination to destination
3. Making new friends along the way :)

## What we learned



## What's next for Hitch
