import { ReactNode, useEffect, useState, useSyncExternalStore, type JSX } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import { anim, text } from './pageTransition.motion';
import { getSessionTransitionPhrase } from '../../constants/transition-phrases.constant';
import { SVG } from './PageTransitionSVG';

import styles from './pageTransition.module.css';
import { useLoaderStore } from '../../stores/loader.store';

type PageTransitionProps = {
    children: ReactNode;
}

// No external subscription needed — the phrase never changes after it's chosen.
const noopSubscribe = () => () => {};

const PageTransition = ({ children }: PageTransitionProps): JSX.Element => {
    const { locale } = useRouter();
    const isLoadingDelay = useLoaderStore(state => state.isLoadingDelay);
    const phrase = useSyncExternalStore(
        noopSubscribe,
        () => getSessionTransitionPhrase(locale),
        () => '',
    );

    const [dimensions, setDimensions] = useState({
        width: 1920,
        height: 1080,
    });

    useEffect(() => {
        function resize() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        resize();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className={styles.curve}>
            <div
                style={{ opacity: dimensions.width == null ? 1 : 0 }}
                className={styles.curve__bg}
            />

            {isLoadingDelay ? (
                <motion.p
                    className={`${styles.curve__route} ${styles.curve__route__transition}`}
                    {...anim(text)}
                >
                    {phrase}
                </motion.p>
            ) : (
                <motion.p
                    className={styles.curve__route}
                    {...anim(text)}
                >
                    {phrase}
                </motion.p>
            )}

            {dimensions.width != null && dimensions.height != null && (
                <div className={styles.curve__svg}>
                    <SVG
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                </div>
            )}

            {children}
        </div>
    );
}

export { PageTransition };