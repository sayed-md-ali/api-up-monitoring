/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/20/2020
 *
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'hsjdhsdhsjdhjshdjshd',
    maxCheck: 5,
    twilio: {
        fromPhone: '+16075369285',
        accountSID: 'AC0bc205f4a98e51001fe9a7462ea6fd33',
        authToken: '331d2f8e5fa7db70024df1395e93ecf2'
    }
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'djkdjskdjksdjksjdskjd',
    maxCheck: 5,
    twilio: {
        fromPhone: '+16075369285',
        accountSID: 'AC0bc205f4a98e51001fe9a7462ea6fd33',
        authToken: '331d2f8e5fa7db70024df1395e93ecf2'
    }
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
