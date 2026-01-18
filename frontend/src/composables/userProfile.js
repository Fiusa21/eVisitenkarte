import { computed, ref } from 'vue';
import KeycloakService from '@/services/keycloak-service';

export function useUserProfile() {
  const userProfileRef = KeycloakService.getIdTokenParsed();

  const userProfile = computed(() => userProfileRef.value || {});

  const formattedAddress = computed(() => {
    const addressClaim = userProfile.value.address;
    if (!addressClaim || typeof addressClaim !== 'object') return '';

    const street = addressClaim.street_address || '';
    const postalCode = addressClaim.postal_code || '';
    const locality = addressClaim.locality || '';

    return [street, `${postalCode} ${locality}`.trim()].filter(p => p).join('\n');
  });

  const userInfoFields = [
    { key: 'first_name', label: 'Vorname' },
    { key: 'last_name', label: 'Nachname' },
    { key: 'company', label: 'Firma' },
    { key: 'title', label: 'Titel' },
    { key: 'email', label: 'E-Mail' },
    { key: 'phone_number', label: 'Telefon' },
    { key: 'mobile_number', label: 'Mobil' }
  ];

  return { userProfile, formattedAddress, userInfoFields };
}