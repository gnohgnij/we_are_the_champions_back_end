# We are the Champions Back End

Tech Stack: ExpressJS, NodeJS, MongoDB

Click [here](https://github.com/gnohgnij/We_are_the_Champions) to view the repository for the front-end.

## Schema

**Team**

| Fields          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| name            | _String_<br> Name of the team                                        |
| registeredDate  | _String_<br> Date of registration                                    |
| group           | _Number_<br> Group number (1 or 2)                                   |
| points          | _Number_<br> Total points scored (3 for win, 1 for draw, 0 for loss) |
| totalGoals      | _Number_<br> Total number goals scored in all matches                |
| alternatePoints | _Number_<br> Total points scored (5 for win, 3 for draw, 1 for loss) |
| opponents       | _Array_<br> List of opponents faced                                  |

**API**

Base URL: https://campeon.herokuapp.com/

GET /api/team

> Get all teams' information

POST /api/team

> Create new team

PATCH /api/team

> Update team's information after match

DELETE /api/team

> Clear all team records

## How to run locally

1. Clone this repository `$ git clone https://github.com/gnohgnij/we_are_the_champions_back_end.git`

2. Navigate to the repositpry directory `$ cd ../we_are_the_champions_back_end`

3. Switch `process.env.MONGODB_URI` variable in _config/db.js_ to `"mongodb+srv://user:dbpassword@cluster0.apmmype.mongodb.net/?retryWrites=true&w=majority"`

4. Run `npm start`
