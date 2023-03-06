export const forgotMessage = (resetUrl, user) => {
  return `
            <body 
              style="
                color: rgb(68, 68, 68);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              "
            >
              <h2 class="title" style="text-align: center">Reset Your Password</h2>
              <h4>Hello ${user.name},</h4>
              <p>
                Tap the link below to reset your account password. If you didn't request a
                new password, you can safely delete this email.
        
                <a
                  class="reset-btn"
                  style="
                    color: rgb(68, 68, 68);
                    font-weight: 900;
                    text-decoration: none;
                    text-transform: uppercase;
                  "
                  target="blank"
                  href="${resetUrl}"
                >
                  Reset Password
                </a>
              </p>
        
              <p>
                If that doesn't work, copy and paste the following link in your browser:
              </p>
              <div class="text-link">
                <a target="blank" href="${resetUrl}"> ${resetUrl} </a>
              </div>
        
              <p class="footer" style="font-size: small; font-style: italic">
                <span>Thank you,</span> <br />
                <span>Websom Team</span>
              </p>
            </body>
        `
}

export const confirmEmail = (name, token) => {
  return `
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    
    <div id="email___content">
        <img src="https://i.imgur.com/eboNR82.png" alt="">
        <h2>Hola ${name}</h2>
        <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
        <a
            href="http://localhost:3000/api/confirm/${token}"
            target="_blank"
        >Confirmar Cuenta</a>
    </div>
  `
}
