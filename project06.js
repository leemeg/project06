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

function main(){
    loadClients();
    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    while (continueResponse === 1) {
        setAction();
        branchAction();


        setContinueResponse();
    }
    writeClients();
}
main();



function setAction() {
    action = -1;
    while (action !== 1 && action !== 2 && action !== 3 && action !== 4){
        action = Number(PROMPT.question(
            `What would you like to do?
            \t1) Enter services performed for new client
            \t2) Enter services performed for existing client
            \t3) Create weekly report
            \t4) Remove a client
            \tPlease enter value: `
        ))
    }
}

function branchAction() {
    switch (action) {
        case 1: addNewClient();
            break;
        case 2: listClients(); setClient(); setService();
            clientsWeekly[client][totalSpent] = clientsWeekly[client][totalSpent] + servAmount;
            break;
        case 3: buildReport();
            break;
        case 4: listClients(); deleteClient();
            break;
    }
}

function buildReport() {



}
function setClient() {
    while (!client || client < 0 || client > clients.length - 1) {
        client = Number(PROMPT.question(`\nPlease enter number of client the service was for: `));
        if (client < 0 || client > clients.length - 1) {
            console.log(`${client} is invalid. Please try again.`);
        }
    }
    return client--;
}

function setService() {
    const MIN_ACTION = 1, MAX_ACTION = 6;
    let moreServe = 1, temp = 0;
    let service;
    while (service == null || service > MAX_ACTION || service < MIN_ACTION || !/[0-9]/.test(service)) {
        service = Number(PROMPT.question(
            `What service was performed?
             \t1) Hair cut
             \t2) Shampoo
             \t3) Manicure
             \t4) Pedicure
             \t5) Perm
             \t6) Massage
             Enter number of service?`
            ));
        if (service == null || service > MAX_ACTION || service < MIN_ACTION || !/[0-9]/.test(service)) {
                console.log(`${service} is an incorrect value. Please try again.`)
            }
        }
        switch (service) {
            case 1:
                servAmount = 50;
                break;
            case 2:
                servAmount = 35;
                break;
            case 3:
                servAmount = 65;
                break;
            case 4:
                servAmount = 75;
                break;
            case 5:
                servAmount = 100;
                break;
            case 6:
                servAmount = 130;
                break;
            default: console.log(`! ERROR !`);
        }
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
    }
    setService();
    clientsWeekly[i][totalSpent] = clientsWeekly[i][totalSpent] + servAmount;
}

function deleteClient() {
    let del;
    while (!del || del < 0 || del > clients.length - 1) {
        del = Number(PROMPT.question(`\nPlease enter number of client to be removed: `));
        if (del < 0 || del > clients.length - 1) {
            console.log(`${del} is invalid. Please try again.`);
        }
    }
    clients.splice(del - 1, 1);
}

function listClients() {
    console.log(`\x1Bc`);
    for (let i = 0; i < clients.length; i++) {
        process.stdout.write(`\n${i + 1}) `);
        for (let j = 1; j < clients[i].length - 1; j++) {
            process.stdout.write(`${clients[i][j]} `)
        }
    }
}

function loadClients() {
    let clientsFile = IO.readFileSync(`data/cudbs_data.csv`, 'utf8');
    let lines = clientsFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        clients.push(lines[i].toString().split(/,/)); // Makes students array MD by pushing data between commas in
    }
    for (let j = 0; j < clients.length; j++){
        clients[j][id] = Number(clients[j][id]);
    }
    for (let k = 0; k < clients.length; k++) {
        clients[k][totalSpent] = Number(clients[k][totalSpent]);
    }
    clientsWeekly = clients.slice()
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