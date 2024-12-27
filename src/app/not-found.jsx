import Link from 'next/link';
import './not-found.scss';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div class="comming-soon">
      <h1 className="heading">
        <Image src={'/image/error-404.webp'} alt="icon not found" width={250} height={250} />
      </h1>
      <p className="text">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <p className="text">Please check the URL and try again, or return to the homepage to continue exploring.</p>
      <Link href="/" className="btn-home">
        <p className="back-home-button">Back Home</p>
      </Link>
    </div>
  );
}
