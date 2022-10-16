import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import cls from 'classnames';

import styles from 'styles/coffee-store.module.css';
import { CoffeeStore, fetchCoffeeStores, Place } from 'lib/coffee-stores';

interface CoffeeStoreProps {
  coffeeStore?: CoffeeStore;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return { params: { id: coffeeStore.id.toString() } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CoffeeStoreProps, Params> = async (
  context
) => {
  const params = context.params!;
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStore: coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params?.id;
      }),
    },
  };
};

const CoffeeStore: NextPage<CoffeeStoreProps> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    console.log('isFallback');
    return <div>Loading...</div>;
  }

  const { name, address, neighborhood, imgUrl } =
    props.coffeeStore as CoffeeStore;

  const handleUpvoteButton = () => {
    console.log('this is upvote');
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>Back to home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              className={styles.storeImg}
              alt={name}
              src={imgUrl as string}
              width={600}
              height={360}
            />
          </div>
        </div>

        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/places.svg' width={24} height={24} />
              <p className={styles.text}>{address}</p>
            </div>
          )}

          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/nearMe.svg' width={24} height={24} />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image src='/static/icons/star.svg' width={24} height={24} />
            <p className={styles.text}>{1}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
