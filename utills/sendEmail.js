const nodeMailer = require("nodemailer");
let currentDate = new Date(Date.now());
let formattedDate = currentDate.toLocaleString();

const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    secure: true,
    auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_APP_PASS,
    }
});

// utils/email.js (or wherever your transporter is defined)

exports.sendFocusSummary = (userEmail, userName, sessionData) => {
    
    // 1. Get Current Date & Time
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    const formattedDate = new Date().toLocaleString('en-US', options);

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: userEmail,
        subject: "[Teletubjed] Great Job! Your Session Summary",
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f4f4f4; padding: 40px 0;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border-top: 5px solid #3b82f6;">
                
                <h2 style="color: #3b82f6; text-align: center; margin-bottom: 10px;">Session Completed! 🎯</h2>
                <p style="text-align: center; color: #666; font-size: 16px; margin-top: 0;">Way to go, <strong>${userName}</strong>!</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <p>You have successfully finished a focus session on <strong>${formattedDate}</strong>. Here is your summary:</p>

                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #555;">🧠 <strong>Focus Duration:</strong></td>
                            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${sessionData.focusTime} mins</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #555;">☕ <strong>Relax Duration:</strong></td>
                            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${sessionData.relaxTime} mins</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #555;">🔄 <strong>Total Rounds:</strong></td>
                            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${sessionData.totalRound}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 50px; font-weight: bold; font-size: 14px;">
                        Focus: ${sessionData.focus ? Math.round(sessionData.focus) : 0}%
                    </div>
                </div>

                <p style="color: #555; line-height: 1.6;">
                    Consistency is key! Keep up the great work and remember to rest well between sessions.
                </p>

                <div style="margin-top: 30px; font-size: 14px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                    <p>Best regards,</p>
                    <p><strong>The Teletubjed Team</strong></p>
                </div>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error("Email Error:", error);
        } else {
            console.log('Summary Email sent: ' + info.response);
        }
    });
};