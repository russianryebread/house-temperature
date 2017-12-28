# House Temperature

Just a simple rasperry pi project to remotely monitor my house temperature, with the option to turn on a heater is needed.

This is a no-soldering-required project, for those of you who would rather just buy some off-the-shelf components, and be done.  This is *not* an in-depth electrical engineering research project. :)

## Hardware

 - [Raspberry Pi](http://amzn.to/2DqaH7c) (~$40, but you could easily use the smaller Pi Zero)
 - [TEMPer USB Temperature Probe](http://amzn.to/2DoXJGA) (~$15)
 - [USB Extension Cable](http://amzn.to/2C5L67v) ($6)
 - [TP-Link HS100 WiFi Smart Plug](http://amzn.to/2Dro47h) (~$ 20)

 Total: $80.00

 ## Software

  - ExpressJS
    - Pug Templating Engine (optional)
    - CORS Middleware
    - Basic Auth Middleware
  - Temper1
  - TP-Link SmartHome API
  - SQLite3
  - Node JS

  ## Building

  Pretty simple:
  
   1. Plug the probe into the extension cord.
   2. Plug the cord into the Pi
   3. Clone this project into your desired directory
   4. Install the dependencies
   5. Copy `env.example` to `.env` and edit the parameters to match your environment.
   6. Run the node application

```bash
# Clone the repo
git clone git@github.com:russianryebread/house-temperature.git

# Install the dependencies
npm install

# Configure the environment file
cp env.example .env

# Use the editor of your choice to edit it
vi .env

# You have to use sudo to read the USB device.  See the section on security for more info.
sudo node index.js
```

The application should be running on the port you set it to, (defaults to port 80) unless that port is already taken.

Enjoy!

# Warranty
None.  I bear no responsibility if this causes your house to freeze, pipes to break, or spontaneous combustion to occur.

# License
Copyright 2017 Ryan Hoshor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.