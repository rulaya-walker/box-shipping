import { Link } from 'react-router-dom';
import review from '../assets/review.png'; // Assuming you have a logo image in your assets folder
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-16 w-full bg-gray-200'>
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
    </div>
    <div className='flex items-center justify-center bg-gray-300 gap-4 p-4'>
        <Link to="/" className='text-md lg:text-lg'><FaFacebook className='w-8 h-8 text-[#1877F2]' /></Link>
        <Link to="/" className='text-md lg:text-lg'><FaTwitter className='w-8 h-8 text-[#1DA1F2]' /></Link>
        <Link to="/" className='text-md lg:text-lg'><FaInstagram className='w-8 h-8 text-[#C13584]' /></Link>
        <Link to="/" className='text-md lg:text-lg'><FaYoutube className='w-8 h-8 text-[#FF0000]' /></Link>
    </div>
    </>
  )
}

export default Footer