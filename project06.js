/**
 *   @author Lee Marshall (marshalll@student.ncmich.edu)
 *   @version 0.0.1
 *   @summary
 *   @todo Nothing
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');

let continueResponse;

let clients = [], rewardClients = [];

function main(){
    loadClients();
    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    while (continueResponse === 1) {
        console.log(clients);

    setContinueResponse();
    }

}
main();

function loadClients() {
    let clientsFile = IO.readFileSync(`data/cudbs_data.csv`, 'utf8');
    let lines = clientsFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        clients.push(lines[i].toString().split(/,/)); // Makes students array MD by pushing data between commas in
    }
}

function writeClients() {
    const COLUMNS = 4;
    for (let i = 0; i < clients.length; i++) {
        if (clients[i]) {
            for (let j = 0; j < COLUMNS; j++) {
                if (j < COLUMNS - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${clients[i][j]},`);
                } else if (i < students.length - 1) {
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

function addNeweClient() {

}

function updateClient() {

}

function deleteClient() {
    
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