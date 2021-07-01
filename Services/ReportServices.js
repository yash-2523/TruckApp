import API from "@aws-amplify/api";
import moment from "moment";

var reportResponse = {
    "from_date": 1234567890,
    "to_date": 1624191720,
    "total_trips": 36,
    "revenue": 13700,
    "payments_made": 14000,
    "payments_received": 2500,
    "profit": -300,
    "balance": 11200
}

const getReport = async (date) => {
    var begin = Math.floor(date.startOf('month').valueOf() / 1000)
    var end = Math.ceil(date.endOf('month').valueOf() / 1000)

    console.log(begin, end) // printing: 1622485800 1625077800

    try {
        reportResponse = await API.post('backend', '/get_report', {
            body: {
                'from_date': begin,
                'to_date': end
            }
        })
        return reportResponse
    } catch {
        return false
    }
}

const getReportPdf = async (type) => {
    console.log(reportResponse)

    try {
        return await API.post('backend', '/get_report_pdf', {
            body: {
                'type': type,
                'report': reportResponse.report
            }
        })
    } catch (error) {
        return error
    }
}


export { getReport, getReportPdf }