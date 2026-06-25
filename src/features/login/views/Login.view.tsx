import type { JSX } from "react";

import { Controller } from "react-hook-form";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { Container } from "@/src/features/home/components/container/Container";
import { Button } from "@/src/shared/components/button/Button";
import { TextField } from "@/src/shared/components/text-field/TextField";
import { Text } from "@/src/shared/components/text/Text";
import { WrapperMotion } from "@/src/shared/components/wrapper-motion/WrapperMotion";
import { FadeIn } from "@/src/shared/components/motion/FadeIn";
import type { ITranslations } from "@/src/shared/interfaces/i18n.interface";

import { useLoginController } from "../hooks/useLogin.controller";

import styles from "./login.module.css";

type LoginViewProps = { t: ITranslations };

const LoginView = ({ t }: LoginViewProps): JSX.Element => {
  const { control, errors, handleSubmit, onSubmit, isPending } =
    useLoginController();

  return (
    <Container className={styles.login} padding="xl">
      <WrapperMotion className={ styles.login__wrapper } classNameSecondary={ styles.login__wrapper } delay={{ enter: 0.6, exit: 0.16 }} immediate>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${styles.login__card} gl-gradient-box`}
          noValidate
        >
          <header className={styles.login__header}>
            <Text
              tag="h1"
              variant="title_small"
              color="secondary"
              weight="bold"
              delay={{ enter: 0.53, exit: 0.15 }}
            >
              {t("title") as string}
            </Text>
            <Text
              tag="p"
              variant="description"
              color="muted"
              delay={{ enter: 0.54, exit: 0.14 }}
            >
              {t("subtitle") as string}
            </Text>
          </header>

          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                type="text"
                label={t("usernameLabel") as string}
                name="username"
                id="username"
                placeholder={t("usernamePlaceholder") as string}
                style="primary"
                feedback={errors.username?.message}
                autoComplete="username"
                delayAnimate={0.55}
                delayExit={0.15}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                required
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                type="password"
                label={t("passwordLabel") as string}
                name="password"
                id="password"
                placeholder={t("passwordPlaceholder") as string}
                style="primary"
                feedback={errors.password?.message}
                autoComplete="current-password"
                delayAnimate={0.56}
                delayExit={0.14}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                required
              />
            )}
          />

          <WrapperMotion delay={{ enter: 0.57, exit: 0.13 }} immediate>
            <Button
              text={t("cta") as string}
              style="primary"
              type="submit"
              icon={faRightToBracket}
              isLoad={isPending}
              disabled={isPending}
            />
          </WrapperMotion>
        </form>
      </WrapperMotion>
    </Container>
  );
};

export { LoginView };
