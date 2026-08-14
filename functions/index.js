const { onSchedule } = require('firebase-functions/v2/scheduler');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

admin.initializeApp();
const db = admin.firestore();

// Create Nodemailer Transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Scheduled Cloud Function running every 5 minutes
 * Scans Firestore todos for upcoming & due tasks and dispatches Gmail reminders.
 */
exports.sendTaskReminders = onSchedule('every 5 minutes', async (event) => {
  logger.info('Starting scheduled TaskFlow Gmail reminder check...');

  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    logger.error(
      'GMAIL_EMAIL or GMAIL_APP_PASSWORD environment variables are not set in Cloud Functions config.'
    );
    return;
  }

  const now = new Date();
  const nowMs = now.getTime();
  const fifteenMinsMs = 15 * 60 * 1000;

  try {
    // Query incomplete tasks with a due date
    const snapshot = await db
      .collection('todos')
      .where('completed', '==', false)
      .get();

    if (snapshot.empty) {
      logger.info('No active tasks found in Firestore.');
      return;
    }

    let emailsSentCount = 0;

    for (const doc of snapshot.docs) {
      const task = doc.data();
      const taskId = doc.id;

      if (!task.dueDate || task.emailNotified) continue;

      const dueTimeMs = new Date(task.dueDate).getTime();
      if (isNaN(dueTimeMs)) continue;

      const diffMs = dueTimeMs - nowMs;
      const diffMins = Math.round(diffMs / (1000 * 60));

      // Trigger if due in 15 mins or starting within 5 mins
      if (diffMs <= fifteenMinsMs && diffMs >= -5 * 60 * 1000) {
        let recipientEmail = task.userEmail;

        // Fallback to Firebase Auth user lookup if userEmail not stored on task
        if (!recipientEmail && task.userId) {
          try {
            const userRecord = await admin.auth().getUser(task.userId);
            recipientEmail = userRecord.email;
          } catch (authErr) {
            logger.warn(`Could not find Auth user for userId: ${task.userId}`);
          }
        }

        if (!recipientEmail) {
          logger.warn(`Skipping task ${taskId}: No recipient email found.`);
          continue;
        }

        // Render HTML Email Body
        const formattedDueTime = new Date(task.dueDate).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        });

        const subject = `⏰ Task Reminder: "${task.title}" is due soon!`;
        const htmlContent = `
          <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 24px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6); -webkit-background-clip: text; color: transparent; font-size: 28px; font-weight: 800; margin: 0;">TaskFlow</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Cloud Task Manager</p>
            </div>
            
            <div style="background: rgba(30, 41, 59, 0.7); padding: 24px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 8px;">${task.title}</h2>
              ${task.description ? `<p style="color: #cbd5e1; font-size: 14px; margin-bottom: 16px;">${task.description}</p>` : ''}
              
              <div style="display: flex; gap: 12px; margin-top: 12px;">
                <span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">Category: ${task.category || 'General'}</span>
                <span style="background: rgba(244, 63, 94, 0.2); color: #fb7185; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">Priority: ${task.priority || 'Medium'}</span>
              </div>
            </div>

            <div style="background: rgba(99, 102, 241, 0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); margin-bottom: 24px; text-align: center;">
              <p style="margin: 0; color: #818cf8; font-size: 14px; font-weight: 600;">Scheduled Due Time:</p>
              <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 800;">${formattedDueTime}</p>
              <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 12px;">(${diffMins > 0 ? `Due in ${diffMins} minutes` : 'Due right now'})</p>
            </div>

            <div style="text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">Sent automatically by TaskFlow Cloud Engine.</p>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"TaskFlow Reminders" <${process.env.GMAIL_EMAIL}>`,
          to: recipientEmail,
          subject,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Successfully sent Gmail reminder to ${recipientEmail} for task "${task.title}"`);

        // Mark doc to prevent duplicate emails
        await doc.ref.update({ emailNotified: true });
        emailsSentCount++;
      }
    }

    logger.info(`TaskFlow reminder check completed. Sent ${emailsSentCount} email notification(s).`);
  } catch (error) {
    logger.error('Error executing sendTaskReminders Cloud Function:', error);
  }
});
