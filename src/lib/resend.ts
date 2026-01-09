import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  // On implémentera ça avec Supabase Auth + Resend
  console.log('TODO: Send reset email to', email, 'with link', resetLink);
  
  // Exemple d'implémentation future:
  // try {
  //   await resend.emails.send({
  //     from: 'GEO Scout <noreply@geoscout.com>',
  //     to: email,
  //     subject: 'Réinitialisation de votre mot de passe',
  //     html: `
  //       <h1>Réinitialisation de mot de passe</h1>
  //       <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</p>
  //       <a href="${resetLink}">${resetLink}</a>
  //     `,
  //   });
  // } catch (error) {
  //   console.error('Error sending email:', error);
  //   throw error;
  // }
}
