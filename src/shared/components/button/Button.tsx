import { ButtonHTMLAttributes, type JSX } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { zoomInMotion } from '../../motion/zoomIn.motion';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import styles from './button.module.css';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

type CustomProps = {
    text?: string;
    style?: 'primary' | 'secondary' | 'fit' | 'whatsapp' | 'ghost';
    className?: string;
    icon?: IconDefinition;
    iconRight?: IconDefinition;
    isLoad?: boolean;
    redirectTo?: string;
} & MotionProps;

type ButtonProps = CustomProps & NativeProps;

const Button = ({ text, style, className, icon, iconRight, isLoad = false, redirectTo, ...props }:ButtonProps):JSX.Element => {
    const router = useRouter();

    // Quiet variants (new design system) skip the decorative hover-scale and
    // sliding-label motion; hover/press feedback is a calm color + press shift.
    const isQuiet = style === 'ghost';

    const handleClick: NativeProps['onClick'] = (event) => {
        props.onClick?.(event);
        if (!redirectTo) return;
        // URLs absolutas (WhatsApp, redes, etc.) se abren en una pestaña nueva;
        // las rutas internas navegan con el router de Next.
        if (/^https?:\/\//.test(redirectTo)) {
            window.open(redirectTo, '_blank', 'noopener,noreferrer');
        } else {
            router.push(redirectTo);
        }
    };

    return (
        <motion.button
            className={ `${styles.button} ${styles[`button--${style}`]} ${className ?? ''} ${isLoad && styles.button__loader}` }
            whileTap={{ scale: isQuiet ? 0.98 : 0.95 }}
            whileHover={isQuiet ? undefined : { scale: 1.05 }}
            {...props}
            onClick={ handleClick }
        >
            <FontAwesomeIcon
                className={ styles.button__icon }
                icon={ icon ?? faArrowRight }
                aria-hidden="true"
            />
            <span>{ text }</span>
            <AnimatePresence mode='wait'>
                {isLoad ? (
                    <motion.div {...zoomInMotion(0,0)}>
                        <FontAwesomeIcon
                            className={ styles.button__iconLoader }
                            icon={ faCircleNotch }
                            aria-hidden="true"
                        />
                    </motion.div>
                ) : (
                    <>
                        {iconRight ? (
                            <motion.div {...zoomInMotion(0,0)}>
                                <FontAwesomeIcon
                                    className={ styles.button__iconSecondary }
                                    icon={ iconRight }
                                    aria-hidden="true"
                                />
                            </motion.div>
                        ) : (
                            <b></b>
                        )}
                    </>
                )}
            </AnimatePresence>
        </motion.button>
    )
}

export { Button }
