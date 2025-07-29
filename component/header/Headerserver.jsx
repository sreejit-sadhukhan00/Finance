import { checkUser } from '@/lib/checkUser';
import HeaderClient from './Headerclient'

export default async function Header() {
  await checkUser();
  return <HeaderClient />
}