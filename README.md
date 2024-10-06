
---

### Back-End (Express.js) Project: **README.md**

```markdown
# NASA Back-End API

This is the back-end API for the NASA project, using Express.js to interact with the NASA API to fetch data like Mars Rover Photos and Astronomy Picture of the Day (APOD).

## Project Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/walidchb/nasa-back.git
    ```

2. Navigate to the project directory:

    ```bash
    cd nasa-back
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Running Tests

If you want to run tests :

```bash
npm test


### Running the Application

1. Start the server:

    ```bash
    node app.js
    ```



### Endpoints

- **GET `/apod/apod`**: Fetches the Astronomy Picture of the Day from the NASA API.
- **GET `/curiosity/photos`**: Fetches images taken by the Curiosity Rover.
- **GET `/opportunity/photos`**: Fetches images taken by the Opportunity Rover.
- **GET `/spirit/photos`**: Fetches images taken by the Spirit Rover.




