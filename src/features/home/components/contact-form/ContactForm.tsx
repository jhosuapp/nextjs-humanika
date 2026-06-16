import type { JSX } from 'react';

import { Controller } from 'react-hook-form';
import { TextField } from '@/src/shared/components/text-field/TextField';
import { Container } from '../container/Container';
import { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Button } from '@/src/shared/components/button/Button';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { allowOnlyNumbers } from '@/src/shared/helpers/allow-keys';
import { useContactFormController } from '../../hooks/useContactForm.controller';
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import styles from './contact-form.module.css';

type ContactFormProps = { t: ITranslations };

const ContactForm = ({ t }: ContactFormProps):JSX.Element => {
    const {
      control,
      errors,
      handleSubmit,
      onSubmit,
      mutation
  } = useContactFormController();

  return (
    <Container>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={ styles.contactForm }
        noValidate
      >
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
                type="text"
                label={t('contact.nameLabel') as string}
                name="name"
                id="name"
                placeholder={t('contact.namePlaceholder') as string}
                minLength={2}
                style="primary"
                feedback={ errors.name?.message }
                maxLength={100}

                delayAnimate={0.57}
                delayExit={0.15}

                onChange={onChange}
                onBlur={onBlur}
                value={value}

                required
            />
          )}
        />

        <Controller
          name="company"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
                type="text"
                label={t('contact.companyLabel') as string}
                name="company"
                id="company"
                placeholder={t('contact.companyPlaceholder') as string}
                minLength={2}
                style="primary"
                feedback={ errors.company?.message }
                maxLength={100}

                delayAnimate={0.57}
                delayExit={0.15}

                onChange={onChange}
                onBlur={onBlur}
                value={value}

                required
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
                type="text"
                label={t('contact.emailLabel') as string}
                name="email"
                id="email"
                placeholder={t('contact.emailPlaceholder') as string}
                minLength={2}
                style="primary"
                feedback={ errors.email?.message }
                maxLength={100}

                delayAnimate={0.57}
                delayExit={0.15}

                onChange={onChange}
                onBlur={onBlur}
                value={value}

                required
            />
          )}
        />
        <div className={styles.contactForm__group}>
          <Controller
            name="phone_extension"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                  type="text"
                  label={t('contact.phoneLabel') as string}
                  name="phone_extension"
                  id="phone_extension"
                  placeholder={t('contact.phoneExtensionPlaceholder') as string}
                  style="primary"
                  feedback={ errors.phone_extension?.message }
                  minLength={1}
                  maxLength={3}
                  onKeyDown={(e) => allowOnlyNumbers(e, { separateThousands: true })}

                  delayAnimate={0.57}
                  delayExit={0.15}
                  classNameParent={ styles.contactForm__extension }

                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}

                  required
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                  type="tel"
                  label={'\u00A0'}
                  name="phone_number"
                  id="phone_number"
                  placeholder={t('contact.phonePlaceholder') as string}
                  style="primary"
                  feedback={ errors.phone_number?.message }
                  maxLength={10}
                  onKeyDown={(e) => allowOnlyNumbers(e, { separateThousands: true })}

                  delayAnimate={0.57}
                  delayExit={0.15}

                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}

                  required
              />
            )}
          />
        </div>

        <WrapperMotion delay={{ enter: 0.57, exit: 0.15 }} immediate>
          <Button
            text={`${mutation.isSuccess ? t('contact.ctaSuccess') as string : t('contact.cta') as string}`}
            style="primary"
            type="submit"
            isLoad={mutation.isPending}
            disabled={mutation.isSuccess}
            iconRight={mutation.isSuccess ? faCircleCheck : undefined}
          />
        </WrapperMotion>
      </form>
    </Container>
  )
}

export { ContactForm }
