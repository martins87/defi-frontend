import Head from 'next/head'

import styles from '../styles/Home.module.css'
import Header from '../components/Header';
// import Account from '../components/Account';
import Balance from '../components/Balance';
import Form from '../components/Form';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>DeFi Frontend</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {/* <Account /> */}
      <Balance />
      <Form /> 
    </div>
  )
}

export default Home;