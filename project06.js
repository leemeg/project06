/**
 *   @author Lee Marshall (marshalll@student.ncmich.edu)
 *   @version 0.0.1
 *   @summary
 *   @todo Nothing
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');
const COLUMNS = 5;
const ID_NUM = 0, FIRST_NAME = 1, LAST_NAME = 2, TOTAL_SPENT = 3, NUM_REWARDS = 4, SERV_PERFOR = 5;
const services = [];
services[0] = ["Hair cut",500];
services[1] = ["Shampoo",35];
services[2] = ["Manicure",65];
services[3] = ["Pedicure",75];
services[4] = ["Perm",100];
services[5] = ["Massage",130];


let continueResponse;
let client;
let clients = [], clientsWeekly = [];


function main(){
    loadClients();
    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    console.log(`\x1Bc`);
    while (continueResponse === 0) {
        let action;
        while (action !== 1 && action !== 2 && action !== 3 && action !== 4){
            action = Number(PROMPT.question(
                `\nWhat would you like to do?
            \t1) Enter services performed for new client
            \t2) Enter services performed for existing client
            \t3) View clients weekly services
            \t4) Update and quit
            \tPlease enter value: `));
        }
        switch (action) {
            case 1: addNewClient(); setService();
                break;
            case 2: listClients(); setClient(); setService();
                break;
            case 3: buildReport();
                break;
            default: continueResponse = 1;
                break;
        }
        setContinueResponse();
    }
    checkNewData();
    mergeData();
    rewardClient();
    writeClients();
}

main();


function rewardClient() {
    const AWARD_FOR = 750;
    console.log(`\x1Bc`);
    for (let i = 0; i < clients.length; i++){
        if (clients[i][TOTAL_SPENT] > AWARD_FOR) {
            if (clients[i][NUM_REWARDS] === 0){
                clients[i][NUM_REWARDS]++;
                console.log(`\n`);
                console.log(`Congratulations ${clients[i][FIRST_NAME]} you have earned your first free hair cut`)
            }
            else
                if (clients[i][TOTAL_SPENT] > ((clients[i][NUM_REWARDS] + 1) * AWARD_FOR)) {
                    clients[i][NUM_REWARDS]++;
                    console.log(`\n`);
                    console.log(`Congratulations ${clients[i][FIRST_NAME]} you have earned a free hair cut`)
                }
        }
    }
}

function mergeData() {
    for (let i = 0; i < clients.length; i++) {
        clients[i][TOTAL_SPENT] = clients[i][TOTAL_SPENT] + clientsWeekly[i][TOTAL_SPENT];
        clients[i][NUM_REWARDS] = clients[i][NUM_REWARDS] + clientsWeekly[i][NUM_REWARDS];
        if (clients[i][ID_NUM] === undefined){
            for (let j = 0; j < COLUMNS; j++) {
                clients[i][j] = clientsWeekly[i][j];
            }
        }
    }
}

function buildReport() {
    console.log(`\x1Bc`);
    console.log(`Client #\tTotal paid\tService(s) performed\n========        ==========      ==================`);
    for (let i = 0; i < clientsWeekly.length; i++){
        if (clientsWeekly[i][SERV_PERFOR][0] === undefined) {
            clientsWeekly[i][SERV_PERFOR][0] = "no service"
        }process.stdout.write(` ${clientsWeekly[i][ID_NUM]}   \t${clientsWeekly[i][TOTAL_SPENT]}\t\t${clientsWeekly[i][SERV_PERFOR]}\n`);
    }
}

function checkNewData() {
    if (clientsWeekly.length > clients.length) {
        console.log(`\x1Bc`);
        console.log(`     ***Warning!!  New client data detected***`);
        console.log(`The following clients were not listed in original file.`);
        console.log(`Client #\tTotal paid\tService(s) performed\n========        ==========      ==================`);
        for (let i = 0; i < clientsWeekly.length - clients.length; /*i++*/) {
            process.stdout.write(` ${clientsWeekly[clients.length][ID_NUM]}   \t${clientsWeekly[clients.length][TOTAL_SPENT]} \t\t${clientsWeekly[clients.length][SERV_PERFOR]}\n`);
            clients[clients.length] = [];
        }
        PROMPT.question(`
        Press Enter to continue.`);
    }
}

function setClient() {
    client = -1;
    while (!client || client < 0 || client > clientsWeekly.length) {
        client = Number(PROMPT.question(`\nPlease enter clients corresponding number: `));
        if (client < 1 || client > clientsWeekly.length) {
            console.log(`${client} is invalid. Please try again.`);
        }
    }client--;
}

function setService() {
    const MIN_ACTION = 1, MAX_ACTION = 6, SERVE_STRING = 0, SERVE_VALUE = 1;
    let service = null;
    console.log(`\x1Bc`);
    console.log(`What service did ${clientsWeekly[client][FIRST_NAME]} receive?`);
    for (let i = 0;i < services.length; i++){
        console.log(`${i + 1}) ${services[i][0]}`)
    }while (service == null || service > MAX_ACTION || service < MIN_ACTION || !/[0-9]/.test(service)) {
        service = Number(PROMPT.question(`Enter service performed: `));
        if (service == null || service > MAX_ACTION || service < MIN_ACTION || !/[0-9]/.test(service)) {
                console.log(`${service} is an incorrect value. Please try again.`)
            }
        }
    clientsWeekly[client][TOTAL_SPENT] = clientsWeekly[client][TOTAL_SPENT] + services[service-1][SERVE_VALUE];
    clientsWeekly[client][SERV_PERFOR].push(services[service-1][SERVE_STRING]);
    console.log(`\nThank you, ${services[service-1][SERVE_STRING]} has been added to ${clientsWeekly[client][FIRST_NAME]}'s weekly services.`)
}

function addNewClient() {

    let i = clientsWeekly.length;
    clientsWeekly[i] = [];
    clientsWeekly[i][ID_NUM] = Number(clientsWeekly[i - 1][ID_NUM]) + 1;
    clientsWeekly[i][TOTAL_SPENT] = 0;
    clientsWeekly[i][NUM_REWARDS] = 0;
    clientsWeekly[i][SERV_PERFOR] = [];
    while (!clientsWeekly[i][FIRST_NAME] || !/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][FIRST_NAME])) {
        clientsWeekly[i][FIRST_NAME] = PROMPT.question(`Please enter first name: `);
        if (!/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][FIRST_NAME])) {
            console.log(`${clientsWeekly[i][FIRST_NAME]} is invalid. Please try again.`);
        }
    }
    while (!clientsWeekly[i][LAST_NAME] || !/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][LAST_NAME])) {
        clientsWeekly[i][LAST_NAME] = PROMPT.question(`Please enter last name: `);
        if (!/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][LAST_NAME])) {
            console.log(`${clientsWeekly[i][LAST_NAME]} is invalid. Please try again.`);
        }
    }
    client = clientsWeekly.length - 1;
}

function listClients() {
    console.log(`\x1Bc`);
    for (let i = 0; i < clientsWeekly.length; i++) {
        console.log(`${i + 1}) ${clientsWeekly[i][FIRST_NAME]} ${clientsWeekly[i][LAST_NAME]}`);
    }
}

function loadClients() {
    let clientsFile = IO.readFileSync(`data/cudbs_data.csv`, 'utf8');
    let lines = clientsFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        clients.push(lines[i].toString().split(/,/)); // Makes array MD by pushing data between commas
    }
    for (let j = 0; j < clients.length; j++) {
        clients[j][ID_NUM] = Number(clients[j][ID_NUM]);
        clients[j][TOTAL_SPENT] = Number(clients[j][TOTAL_SPENT]);
        clients[j][NUM_REWARDS] = Number(clients[j][NUM_REWARDS]);
    }
    for (let k = 0; k < clients.length; k++) {
        clientsWeekly[k] = [];
        for (let l = 0; l < COLUMNS; l++) {
            clientsWeekly[k][l] = clients[k][l];
        }
        clientsWeekly[k][TOTAL_SPENT] = 0;
        clientsWeekly[k][NUM_REWARDS] = 0;
        clientsWeekly[k][SERV_PERFOR] = [];
    }
}

function writeClients() {
    for (let i = 0; i < clients.length; i++) {
        if (clients[i]) {
            for (let j = 0; j < COLUMNS; j++) {
                if (j < COLUMNS - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]},`);
                } else if (i < clientsWeekly.length - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]}\n`);
                } else {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]}`);
                }
            }
        }
    }
    IO.unlinkSync(`data/cudbs_data.csv`);//deletes file
    IO.renameSync(`data/dataX.csv`, `data/cudbs_data.csv`);//renames new file with old name
    console.log(`\n
    \nThank you, all files have been updated.`)
}

function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nAre you sure you want to quit? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 0;
    }
}