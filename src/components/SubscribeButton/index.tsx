import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SuscribeButtonProps {
  priceId: string;
}


export function SubscribeButton({ priceId }: SuscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return;
    }
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({sessionId});

    } catch (error) {
      alert(error.message);
    }

  }

  return (
    <button
      type="button"
      className={styles.suscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>

  )
}