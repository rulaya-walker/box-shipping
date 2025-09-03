import { Link } from 'react-router-dom';
import review from '../assets/review.png'; // Assuming you have a logo image in your assets folder
import { FaFacebook, FaInstagram, FaLinkedin, FaLocationArrow, FaPinterest, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

const Footer = () => {
  return (
    <>
    {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-16 w-full bg-gray-200'>
      <div className='flex flex-col justify-center items-center'>
        <img src={review} alt="Logo" className='mb-4' />
      </div>
        <div className='flex flex-col justify-center text-[#777777] '>
            <h2 className='text-xl lg:text-2xl font-semibold mb-4 text-primary'>Useful Informations</h2>
            <Link to="/" className='text-md lg:text-lg mb-2 hover:underline'>Our global shipping statuses</Link>
            <Link to="/" className='text-md lg:text-lg mb-2 hover:underline'>Contact us</Link>
            <Link to="/" className='text-md lg:text-lg mb-2 hover:underline'>Privacy Policy</Link>
            <Link to="/" className='text-md lg:text-lg mb-2 hover:underline'>Email Us</Link>
        </div>
    </div> */}
    <div className='bg-primary py-12'>
      <p className='text-white text-center text-lg'>Copyright &copy; 2025 Removals.co.uk</p>
      <div className='flex items-center justify-center gap-4 p-4'>
        <Link to="https://www.facebook.com/Removals.co.uk" className='text-md lg:text-lg' target="_blank"><FaFacebook className='w-8 h-8 text-white' /></Link>
        <Link to="https://www.linkedin.com/in/removalscouk/" className='text-md lg:text-lg' target="_blank"><FaLinkedin className='w-8 h-8 text-white' /></Link>
        <Link to="https://www.instagram.com/removals.co.uk" className='text-md lg:text-lg' target="_blank"><FaInstagram className='w-8 h-8 text-white' /></Link>
        <Link to="https://www.youtube.com/@removalscouk" className='text-md lg:text-lg' target="_blank"><FaYoutube className='w-8 h-8 text-white' /></Link>
        <Link to="https://maps.app.goo.gl/x3PguATwpPFF34b69" className='text-md lg:text-lg' target="_blank"><FaLocationDot className='w-8 h-8 text-white' /></Link>
        <Link to="https://maps.app.goo.gl/x3PguATwpPFF34b69" className='text-md lg:text-lg' target="_blank"><FaPinterest className='w-8 h-8 text-white' /></Link>
    </div>

    </div>
    
    </>
  )
}

export default Footer