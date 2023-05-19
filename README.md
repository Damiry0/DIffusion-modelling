# Diffusion Modelling
Modeling diffusion (information) in social networks/graphs.
## Website
TODO

## Local

To build and run locally:

1. Clone repository and install requirments 
    ```
    git clone https://github.com/Damiry0/Diffusion-modelling.git
    git checkout dev
    pip install -r requirements.txt
    ```
2. Install Node.Js 
   ```
   https://nodejs.org/en/download
   ```
3. Install Angular Cli
   ```
   npm install -g @angular/cli
   ```
4. Install npm packages 
   ```
   cd web-app
   npm install
   ```
5. Run website
    ```
    uvicorn api:app --reload
    cd web-app
    ng serve
    ```