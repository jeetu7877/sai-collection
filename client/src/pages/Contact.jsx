import { useForm } from "react-hook-form";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = () => {
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <p className="eyebrow mb-3">Get In Touch</p>
      <h1 className="section-title mb-10">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6 space-y-4">
          <input {...register("name", { required: true })} placeholder="Your name" className="input-field" />
          <input {...register("email", { required: true })} type="email" placeholder="Email address" className="input-field" />
          <textarea {...register("message", { required: true })} placeholder="Your message" rows={5} className="input-field" />
          <button className="btn-primary w-full justify-center">Send Message</button>
        </form>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <FiMapPin className="text-accent shrink-0" size={20} />
            <div><p className="text-white font-medium">Visit Us</p><p className="text-sm text-gray-500">MI Road, Jaipur, Rajasthan, India</p></div>
          </div>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <FiPhone className="text-accent shrink-0" size={20} />
            <div><p className="text-white font-medium">Call Us</p><p className="text-sm text-gray-500">+91 98765 43210</p></div>
          </div>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <FiMail className="text-accent shrink-0" size={20} />
            <div><p className="text-white font-medium">Email Us</p><p className="text-sm text-gray-500">hello@menstylepro.com</p></div>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <iframe title="Store map" src="https://www.google.com/maps?q=Jaipur,Rajasthan,India&output=embed" className="w-full h-56 border-0" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
}
