# Boston Scavenger

Project for CSCI S-71: Agile Software Development. A web application for finding food trucks in Boston.

## Table of Contents

- [Project Team](#project-team)
- [Product Design](#product-design)
- [Product Backlog](#product-backlog)
- [Development](#development)

## Project Team

### Team Name

The Agile Connors

### Team Members

- Kerry Conley - *Product Owner*
- Kyle Maguire - *Scrum Master*
- Benjamin Jenkins - *Developer*
- Henry Chase - *Developer*
- Lennart Meincke - *Developer*

## Product Design

### Product Name

Boston Scavenger

### Far Vision

Demystify food trucks worldwide, enhancing the experience with some best practices from restaurants like: where and when to find them, how to get them to your neighborhood, and ordering ahead to earn points.

### Near Vision

Provide people local to Boston with up-to-date information about good, transient food sources nearby.

### Tag Line

*Sometimes your schedule makes finding food hard. If only there was a way you could find good, interesting food trucks close by... Soon you can with Boston Scavenger!*

### Stakeholders

- Local college students *(Danielle Alexandrine Madriaga)*
- Local working adults
- Food truck owners and operators

#### User Persona

![Danielle Madriaga](user-persona.png)<br />
**Name:** Danielle Alexandrine Madriaga<br />
**Age:** 19<br />
**Occupation:** Student<br />
**Interests:** Traveling, singing, eating<br />
**Description:** Danielle is a Harvard Summer School student and has class from 6:30 - 9:30 pm. Because Cabot Dining Hall dinner closes at 7:15 PM, she can never have dinner. Danielle also likes to eat local food at food trucks, but has trouble finding trucks nearby when her class is over.

## Product Backlog

The product backlog is maintained using Trello and is publicly accessible [here](https://trello.com/b/sfmmsg8h/agile-connors).

### Backlog Sizing

Backlog items were initially sized using relative mass valuation. Team members collaborated to order all existing backlog items from smallest to largest. These items were then organized into groups of similar size and story points were assigned based on these groups.

*Note: Only development team members participated in sizing backlog items.*

### Backlog Order

The rationale behind the initial ordering of the product backlog is primarily based on dependencies. The product has somewhat of a technical prerequisite in that it needs to display a geographic map and consume data from an existing API. Most of the product features depend on this base functionality existing.

Additionally, backlog items are generally prioritized higher if they are known to be more feasible. For example, product features that utilize data that definitely exists in the API we plan to use are prioritized higher.

Otherwise, features are examined for effort vs. impact and prioritized accordingly. This means that the implementation complexity is compared to how far the feature moves the product toward the product vision.

### Estimating Activity
We used affinity estimating to estimate our product backlog.

## Story Points Forecast
Our initial forecast is eight story points.

Our fist eight story points encompass:
* Creating a map of Boston
* Showing all of the food trucks on the map
* Showing the truck's availability and title when clicked on or hovered over
* Having the option to filter by which day of the week trucks are open

We chose eight story points because the above realistically seems like what 
we could complete in 2 days while producing a stable product increment.

### Definition of Ready

- [ ] The backlog item has a **title**.
- [ ] The backlog item has a **user story sentence**.
- [ ] The backlog item has **one or more acceptance criteria**.
- [ ] The backlog item is **estimated in story points** and is **5 points or less**.
- [ ] The backlog item has any **additional details** needed to understand the requirements.

## Development

Download and install [Node.js](https://nodejs.org/en/) if you don't already have it. This project was developed with Node v4.6.0. Any higher version should also work.

To set up the project and start the server, perform the following commands.

```sh
# Clone the repository.
git clone https://github.com/kylepixel/agile-connors.git

# Change directory.
cd agile-connors

# Install dependencies.
npm install

# Start the server.
npm start
```

Finally, open `localhost:3000` in a web browser.

## Resources
* Truck Icon made by [Nikita Golubev](http://www.flaticon.com/authors/nikita-golubev) from www.flaticon.com 