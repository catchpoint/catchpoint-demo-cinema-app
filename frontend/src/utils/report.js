// disable eslint
/* eslint-disable */

import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function arrayToHtmlTable(array) {
    if (array.length === 0) {
        return '';
    }

    var keys = Object.keys(array[0]);

    var table = '<table><thead><tr>';
    keys.forEach(function (key) {
        table += '<th>' + key + '</th>';
    });
    table += '</tr></thead><tbody>';

    array.forEach(function (item) {
        table += '<tr>';
        keys.forEach(function (key) {
            table += '<td>' + clearReserved(item[key]) + '</td>';
        });
        table += '</tr>';
    });

    table += '</tbody></table>';

    return table;
}


export function arrayToXmlTable(array) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<table>\n';

    // Extracting headers from the first object in the array
    const headers = Object.keys(array[0]);

    // Generating header row
    xml += '\t<tr>\n';
    headers.forEach(header => {
        xml += `\t\t<th>${header}</th>\n`;
    });
    xml += '\t</tr>\n';

    // Generating data rows
    array.forEach(item => {
        xml += '\t<tr>\n';
        headers.forEach(header => {
            xml += `\t\t<td>${clearReserved(item[header])}</td>\n`;
        });
        xml += '\t</tr>\n';
    });

    xml += '</table>';

    return xml;
}

export function arrayToPdfTable(array) {
    const doc = new jsPDF({
        orientation: 'landscape',
    });

    autoTable(doc, {
        head: [Object.keys(array[0])],
        body: array.map(item => Object.values(item)),
        styles: {
            cellWidth: 'wrap',
            fontSize: 8,
            rowHeight: 12,
        },
    });
    return doc;
}


export function downloadReservation(reservation) {
    const doc = new jsPDF();

    doc.setFontSize(36);
    doc.text('SQLCinema', doc.internal.pageSize.getWidth() / 2, 20, {
        align: 'center'
    });


    doc.setFontSize(20);

    // center text
    doc.text('Reservation', doc.internal.pageSize.getWidth() / 2, 30, {
        align: 'center'
    });

    doc.setFontSize(12);
    doc.text(`Reservation ID: ${reservation.reservationId}`, 10, 40);
    doc.text(`Movie: ${reservation.movieTitle}`, 10, 50);

    doc.setFontSize(10);
    // ticket id
    doc.text(`Ticket ID: ${reservation.ticketId}`, 10, 60);

    //username
    doc.text(`Username: ${reservation.username}`, 10, 70);
    // seat
    doc.text(`Seat: ${reservation.seatCodes.join(", ")}`, 10, 80);
    // date
    doc.text(`Date: ${dayjs(reservation.showTime).format('DD.MM.YYYY HH:mm')}`, 10, 90);
    // price
    doc.text(`Price: ${reservation.price} $`, 10, 100);
    // payment method
    doc.text(`Payment Type: ${reservation.paymentType}`, 10, 110);

    doc.save(`reservation-${reservation.reservationId}.pdf`);

}





export function downloadFile(fileName, content) {
    if (fileName.endsWith('.pdf')) {
        content.save(fileName);
    } else {
        const element = document.createElement("a");
        const file = new Blob([content], {
            type: 'text/plain'
        });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
}


function clearReserved(txt) {
    return txt && txt
        .toString()
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('\'', '&apos;')
}