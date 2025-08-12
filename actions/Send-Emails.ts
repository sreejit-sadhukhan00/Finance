'server actions';
import {Resend} from "resend";

export async function sendEmails({to,subject,react}:{
    to: string,
    subject: string,
    react: any
}){
    const resend= new Resend(process.env.RESEND_API_KEY || "");
    try {
        const data=await resend.emails.send({
             from: 'Acme <onboarding@resend.dev>',
             to,
             subject,
             react
        });
        return {success: true, data};
    } catch (error) {
        console.error("Error sending email:", error);
        return {success: false, error: error instanceof Error ? error.message : "Unknown error"};
    }
}