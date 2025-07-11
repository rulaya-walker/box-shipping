import bgImage from '../assets/banner.jpg'; // Adjust the path as necessary

const BannerImage = () => {
  return (
    <div className='bg-cover bg-center h-96' style={{ backgroundImage: `url(${bgImage})` }}>
      <h1 className='text-white text-3xl font-bold'>Welcome to Our Store</h1>
    </div>
  )
}

export default BannerImage