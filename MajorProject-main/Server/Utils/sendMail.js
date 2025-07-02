const nodemailer = require("nodemailer");

// Function to send emails using Nodemailer
const sendMail = async (to, subject, text, name) => {
  try {
    // Create a Nodemailer transporter using your email service provider's details
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "snowbizzfashion@gmail.com",
        pass: "teeu mcay tsft xfat",
      },
    });
    const htmlContent = `
    
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SnowBizz Fashion - Welcome to the Stylish Community!</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
            }
    
            .container {
                background: linear-gradient(to right, #c9dff3, #b0c2f8);
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                /* color: white !important; */
            }
    
            .header {
                text-align: center;
                color: black;
                /* background-color: #8A2BE2; */
                padding: 10px;
                border-radius: 8px;
            }
    
            .header h1 {
                color: black;
                margin: 0;
            }
    
            .content {
                padding: 20px;
                color: #333;
            }
    
            .btn {
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
            }
    
            .content p {
                color: black;
                line-height: 1.5;
            }
    
            .button {
                background: linear-gradient(to right, #76b4ee, #5f83f0);
                padding: 10px 20px;
                background-color: #5d48e1;
                color: #fffcfc;
                text-decoration: none;
                border-radius: 5px;
                display: block;
                margin: 0 auto;
                text-align: center;
                text-decoration: none;
            }
            .button a{
                display: block;
                margin: 0 auto;
            }
    
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #888;
            }
    
            .logo img {
                height: 120px;
                width: 120px;
                display: block;
                margin: 0 auto;
            }
    
            .logo {
                text-align: center;
              }
              
             
              
    
            .fL img {
                height: 45px;
                width: 90px;
            }
        </style>
    </head>
    
    <body>
        <div class="container">

        <div class="logo">
        <img src="https://res.cloudinary.com/dwmdkrjhk/image/upload/v1706019375/Snowbizz_full_vdiyds.png" alt="" srcset="">
      </div>
      
            
            <div class="header">
                <h1>Welcome to SnowBizz Fashion!</h1>
            </div>
    
            <div class="content">
                <p>Dear ${name}!</p>
                <p>Thank you for joining the SnowBizz Fashion community, where style knows no bounds. Your journey into the
                    world of fashion and elegance begins now!</p>
    
                <p>Your stylish journey begins now! To unlock the world of fashion delights, click the button below to
                    explore styles:</p>
    
                <div class="btn">
    
                    <center><a class="button" href="https://snowbizzclothing.com" target="_blank">Explore
                        Styles!</a></center>
                </div>
    
                <p>If you haven't signed up for SnowBizz Fashion, simply ignore this email.</p>
                <p>With Regards,</p>
                <!-- Team SnowBizz</p> -->
                <div class="fL">
    
                    <img src="https://res.cloudinary.com/dwmdkrjhk/image/upload/v1706019633/Snowbizz_linht1.png" alt=""
                        srcset="">
                </div>
            </div>
    
            <div class="footer">
                <p>Contact us at support@snowbizzfashion.com for any assistance.</p>
            </div>
        </div>
    
    </body>
    
    </html>
  `;
    // Define email options
    const mailOptions = {
      from: "snowbizzfashion@gmail.com", // Sender's email address
      to: to, // Receiver's email address
      subject: subject, // Email subject
      text: text, // Email body
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email: ", error.message);
    throw error;
  }
};

module.exports = sendMail;
