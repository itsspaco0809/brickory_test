import { Link } from '@/lib/router';
import { Mail } from 'lucide-react';

export default function Footer({
  hidden = false,
}: {
  hidden?: boolean;
}) {
  const socialLinks = [
    {
      name: 'Email',
      href: 'mailto:hello@brickory.com',
      icon: <Mail className="w-5 h-5 shrink-0 stroke-[1.75]" />,
    },
  ];
  return (
    <footer
      data-sticky-footer
      className="
        w-full
        bg-white
        dark:bg-[#121212]
        lg:border-t
        border-white
        dark:border-[#121212]
        select-none
        overflow-hidden
        transition-colors
        duration-300
      "
      style={{
        ...(hidden
          ? {
              opacity: 0,
              visibility: 'hidden',
            }
          : {}),
        paddingBottom:
          'env(safe-area-inset-bottom)',
        backgroundColor:
          'var(--footer-background)',
        borderTopColor:
          'var(--footer-background)',
      }}
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-4
          pb-6
          lg:pb-10
        "
      >
        {/* =================================================
            BRAND
            ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-10
          "
        >
          <div className="md:col-span-2">
            <div
              className="
                flex
                items-center
                mb-4
                -mt-2
              "
            >
              <img
                src="/brickory-logo.svg"
                alt="Brickory logo"
                className="
                  h-16
                  w-auto
                  object-contain
                  brightness-0
                  dark:invert
                  transition-all
                  duration-300
                "
              />
            </div>

            <p
              className="
                text-neutral-600
                dark:text-neutral-400
                text-sm
                leading-relaxed
                max-w-md
                transition-colors
                duration-300
              "
            >
              Curated building sets from independent and established brands across Asia, selected for builders and collectors.
            </p>

            <div
              className="
                flex
                gap-3
                mt-6
              "
            >
              {socialLinks.map(
                (item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    aria-label={item.name}
                    target={
                      item.href.startsWith(
                        'http'
                      )
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      item.href.startsWith(
                        'http'
                      )
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-neutral-100
                      dark:bg-[#1a1a1a]
                      border
                      border-neutral-200
                      dark:border-neutral-800
                      flex
                      items-center
                      justify-center
                      text-neutral-600
                      dark:text-neutral-400
                      hover:text-neutral-950
                      dark:hover:text-white
                      hover:bg-neutral-200
                      dark:hover:bg-neutral-800
                      transition-all
                      duration-300
                      hover:scale-105
                      shrink-0
                      touch-manipulation
                    "
                  >
                    {item.icon}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            BOTTOM BAR
            ================================================= */}

        <div
          className="
            mt-8
            pt-6
            lg:mt-12
            lg:pt-8
            border-t
            border-neutral-200
            dark:border-neutral-800
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-6
            transition-colors
            duration-300
          "
        >
          <p
            className="
              text-neutral-500
              dark:text-neutral-500
              text-xs
              text-center
              lg:text-left
              transition-colors
              duration-300
            "
          >
            © {new Date().getFullYear()} Brickory. All rights reserved. Product brands and trademarks belong to their respective owners.
          </p>

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              gap-6
            "
          >
            {/* =================================================
                LEGAL LINKS
                3 ITEMS × 2 ROWS
                ================================================= */}

            <div
              className="
                grid
                grid-cols-3
                items-center
                justify-items-center
                gap-x-5
                gap-y-3
                w-full
                sm:w-auto
              "
            >
              <Link
                to="/privacy-policy"
                className="
                  text-neutral-500
                  dark:text-neutral-500
                  text-xs
                  whitespace-nowrap
                  text-center
                  hover:text-neutral-950
                  dark:hover:text-white
                  transition-colors
                  duration-300
                "
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-of-service"
                className="
                  text-neutral-500
                  dark:text-neutral-500
                  text-xs
                  whitespace-nowrap
                  text-center
                  hover:text-neutral-950
                  dark:hover:text-white
                  transition-colors
                  duration-300
                "
              >
                Terms of Service
              </Link>

              <Link
                to="/legal-notice"
                className="
                  text-neutral-500
                  dark:text-neutral-500
                  text-xs
                  whitespace-nowrap
                  text-center
                  hover:text-neutral-950
                  dark:hover:text-white
                  transition-colors
                  duration-300
                "
              >
                Legal Notice
              </Link>

              <Link
                to="/shipping-info"
                className="
                  text-neutral-500
                  dark:text-neutral-500
                  text-xs
                  whitespace-nowrap
                  text-center
                  hover:text-neutral-950
                  dark:hover:text-white
                  transition-colors
                  duration-300
                "
              >
                Shipping Info
              </Link>

              <Link
                to="/refund-policy"
                className="
                  text-neutral-500
                  dark:text-neutral-500
                  text-xs
                  whitespace-nowrap
                  text-center
                  hover:text-neutral-950
                  dark:hover:text-white
                  transition-colors
                  duration-300
                "
              >
                Refund Policy
              </Link>

              <Link
                to="/cancellation-policy"
                className="
                  text-neutral-500
                  dark:text-neutral-500
                  text-xs
                  whitespace-nowrap
                  text-center
                  hover:text-neutral-950
                  dark:hover:text-white
                  transition-colors
                  duration-300
                "
              >
                Cancellation Policy
              </Link>
            </div>

            {/* =================================================
                PAYMENT ICONS
                ================================================= */}

            <div
              className="
                flex
                items-center
                gap-1.5
                shrink-0
              "
            >
              {/* Apple Pay */}

              <div
                className="
                  h-6
                  px-2
                  rounded
                  bg-neutral-100
                  dark:bg-[#1a1a1a]
                  border
                  border-neutral-200
                  dark:border-neutral-800
                  flex
                  items-center
                  justify-center
                  font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]
                  transition-colors
                  duration-300
                "
              >
                <span
                  className="
                    text-[11px]
                    font-semibold
                    tracking-tight
                    text-neutral-900
                    dark:text-white
                    flex
                    items-center
                    gap-0.5
                    transition-colors
                    duration-300
                  "
                >
                  <span
                    className="
                      text-[13px]
                      leading-none
                      -mt-0.5
                    "
                  >
                    
                  </span>
                  Pay
                </span>
              </div>

              {/* VISA */}

              <div
                className="
                  h-6
                  px-2
                  rounded
                  bg-neutral-100
                  dark:bg-[#1a1a1a]
                  border
                  border-neutral-200
                  dark:border-neutral-800
                  flex
                  items-center
                  justify-center
                  transition-colors
                  duration-300
                "
              >
                <span
                  className="
                    font-extrabold
                    italic
                    text-[11px]
                    tracking-wider
                    text-neutral-900
                    dark:text-white
                    transition-colors
                    duration-300
                  "
                >
                  VISA
                </span>
              </div>

              {/* Mastercard */}

              <div
                className="
                  h-6
                  px-2
                  rounded
                  bg-neutral-100
                  dark:bg-[#1a1a1a]
                  border
                  border-neutral-200
                  dark:border-neutral-800
                  flex
                  items-center
                  justify-center
                  transition-colors
                  duration-300
                "
              >
                <div
                  className="
                    flex
                    items-center
                    -space-x-1.5
                  "
                >
                  <div
                    className="
                      w-3
                      h-3
                      rounded-full
                      bg-[#EB001B]
                    "
                  />

                  <div
                    className="
                      w-3
                      h-3
                      rounded-full
                      bg-[#F79E1B]
                      opacity-90
                    "
                  />
                </div>
              </div>

              {/* AMEX */}

              <div
                className="
                  h-6
                  px-1.5
                  rounded
                  bg-[#016FD0]
                  flex
                  items-center
                  justify-center
                "
              >
                <span
                  className="
                    font-bold
                    text-[9px]
                    text-white
                    tracking-tight
                  "
                >
                  AMEX
                </span>
              </div>

              {/* JCB */}

              <div
                className="
                  h-6
                  px-1.5
                  rounded
                  bg-neutral-100
                  dark:bg-[#1a1a1a]
                  border
                  border-neutral-200
                  dark:border-neutral-800
                  flex
                  items-center
                  justify-center
                  transition-colors
                  duration-300
                "
              >
                <div
                  className="
                    flex
                    items-center
                    h-3.5
                    rounded-[2px]
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      bg-[#003A8F]
                      h-full
                      px-0.5
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        font-extrabold
                        text-[8px]
                        text-white
                        leading-none
                      "
                    >
                      J
                    </span>
                  </div>

                  <div
                    className="
                      bg-[#E60012]
                      h-full
                      px-0.5
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        font-extrabold
                        text-[8px]
                        text-white
                        leading-none
                      "
                    >
                      C
                    </span>
                  </div>

                  <div
                    className="
                      bg-[#00873C]
                      h-full
                      px-0.5
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        font-extrabold
                        text-[8px]
                        text-white
                        leading-none
                      "
                    >
                      B
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}