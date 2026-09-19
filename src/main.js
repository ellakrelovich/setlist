import { registerRoute, registerNotFound, startRouter } from './lib/router.js';
import { HomePage } from './pages/home.js';
import { TalentSearchPage } from './pages/talent-search.js';
import { VenueSearchPage } from './pages/venue-search.js';
import { ArtistProfilePage } from './pages/artist-profile.js';
import { VenueProfilePage } from './pages/venue-profile.js';
import { AboutPage } from './pages/about.js';
import { LoginPage } from './pages/login.js';
import { BookingPage } from './pages/booking.js';
import { PaymentPage } from './pages/payment.js';
import { CreateArtistPage } from './pages/create-artist.js';
import { CreateVenuePage } from './pages/create-venue.js';
import { NotFoundPage } from './pages/not-found.js';

registerRoute('/', HomePage);
registerRoute('/talent', TalentSearchPage);
registerRoute('/venues', VenueSearchPage);
registerRoute('/artist/:id', ArtistProfilePage);
registerRoute('/venue/:id', VenueProfilePage);
registerRoute('/about', AboutPage);
registerRoute('/login', LoginPage);
registerRoute('/booking/:id', BookingPage);
registerRoute('/payment', PaymentPage);
registerRoute('/create/artist', CreateArtistPage);
registerRoute('/create/venue', CreateVenuePage);
registerNotFound(NotFoundPage);

startRouter(document.getElementById('app'));
