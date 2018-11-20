/**
 *   @author Lee Marshall (marshalll@student.ncmich.edu)
 *   @version 0.0.1
 *   @summary
 *   @todo Nothing
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');
const COLUMNS = 4;

let continueResponse;
let action, servAmount, client;
let id = 0, firstName = 1, lastName = 2, totalSpent = 3;
let clients = [], clientsWeekly = [], rewardClients = [];
let services = [];
services[0] = ["Hair cut",50];
services[1] = ["Shampoo",35];
services[2] = ["Manicure",65];
services[3] = ["Pedicure",75];
services[4] = ["Perm",100];
services[5] = ["Massage",130];

function main(){
    loadClients();

    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    while (continueResponse === 1) {
        setAction();
        branchAction();

        console.log(clients, clientsWeekly);
        setContinueResponse();
    }
    //writeClients();
}
main();



function setAction() {
    action = -1;
    console.log(`\x1Bc`);
    while (action !== 1 && action !== 2 && action !== 3){
        action = Number(PROMPT.question(
            `What would you like to do?
            \t1) Enter services performed for new client
            \t2) Enter services performed for existing client
            \t3) Create weekly report
            \tPlease enter value: `
        ))
    }
}

function branchAction() {
    switch (action) {
        case 1: addNewClient(); setService();
            clientsWeekly[client][totalSpent] = clientsWeekly[client][totalSpent] + servAmount;
            break;
        case 2: listClients(); setClient(); setService();
            clientsWeekly[client][totalSpent] = clientsWeekly[client][totalSpent] + servAmount;
            break;
        case 3: buildReport();
            break;
    }
}

function buildReport() {



}
function setClient() {
    client = -1;
    while (!client || client < 0 || client > clientsWeekly.length) {
        client = Number(PROMPT.question(`\nPlease enter clients corresponding number: `));
        if (client < 0 || client > clientsWeekly.length) {
            console.log(`${client} is invalid. Please try again.`);
        }
    }client--;
}

function setService() {
    const MIN_ACTION = 1, MAX_ACTION = 6;
    let service;
    console.log(`\x1Bc`);
    console.log(`What service did ${clientsWeekly[client][firstName]} receive?`);
    for (let i = 0;i < services.length; i++){
        console.log(`${i + 1}) ${services[i][0]}`)
    }while (service == null || service > MAX_ACTION || service < MIN_ACTION || !/[0-9]/.test(service)) {
        service = Number(PROMPT.question(`What service was performed? `));
        if (service == null || service > MAX_ACTION || service < MIN_ACTION || !/[0-9]/.test(service)) {
                console.log(`${service} is an incorrect value. Please try again.`)
            }
        }servAmount = services[service-1][1];
        return servAmount;
}

function addNewClient() {

    let i = clients.length;
    clientsWeekly[i] = [];
    clientsWeekly[i][id] = Number(clientsWeekly[i - 1][id]) + 1;
    clientsWeekly[i][totalSpent] = 0;
    while (!clientsWeekly[i][firstName] || !/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][firstName])) {
        clientsWeekly[i][firstName] = PROMPT.question(`Please enter first name: `);
        if (!/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][firstName])) {
            console.log(`${clientsWeekly[i][firstName]} is invalid. Please try again.`);
        }
    }
    while (!clientsWeekly[i][lastName] || !/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][lastName])) {
        clientsWeekly[i][lastName] = PROMPT.question(`Please enter last name: `);
        if (!/^[a-zA-Z -]{1,30}$/.test(clientsWeekly[i][lastName])) {
            console.log(`${clientsWeekly[i][lastName]} is invalid. Please try again.`);
        }
    }client = clientsWeekly.length - 1;
}

function listClients() {
    console.log(`\x1Bc`);
    for (let i = 0; i < clientsWeekly.length; i++) {
        process.stdout.write(`\n${i + 1}) `);
        for (let j = 1; j < clientsWeekly[i].length - 1; j++) {
            process.stdout.write(`${clientsWeekly[i][j]} `)
        }
    }
}

function loadClients() {
    let clientsFile = IO.readFileSync(`data/cudbs_data.csv`, 'utf8');
    let lines = clientsFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        clients.push(lines[i].toString().split(/,/)); // Makes students array MD by pushing data between commas in
    }
    for (let j = 0; j < clients.length; j++) {
        clients[j][id] = Number(clients[j][id]);
    }
    for (let k = 0; k < clients.length; k++) {
        clients[k][totalSpent] = Number(clients[k][totalSpent]);
    }
    const MAX = 2;
    for (let l = 0; l < clients.length; l++){
        clientsWeekly[l] = [];
        clientsWeekly[l][totalSpent] = 0;
        for (let m = 0; m <= MAX; m++){
            clientsWeekly[l][m] = clients[l][m];
        }
    }
}

function writeClients() {
    for (let i = 0; i < clients.length; i++) {
        if (clients[i]) {
            for (let j = 0; j < COLUMNS; j++) {
                if (j < COLUMNS - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]},`);
                } else if (i < clients.length - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]}\n`);
                } else {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]}`);
                }
            }
        }
    }
    IO.unlinkSync(`data/cudbs_data.csv`);//deletes file
    IO.renameSync(`data/dataX.csv`, `data/cudbs_data.csv`);//renames new file with old name
}

function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nDo you want to continue? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 1;
    }
}