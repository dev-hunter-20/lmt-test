'use client';

import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './TourGuide.scss';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';

export default function TourGuide({
  setIsDropdownVisible,
  setIsDropdownVisibleInsights,
  setIsDropdownControlledByTour,
  setIsDropdownControlledByTour1,
  handleSuccess,
}) {
  useEffect(() => {
    const handleTourApi = async (isDone, step) => {
      await LandingPageApiService.handleShowOnboard(isDone, step);
      handleSuccess();
    };

    const handleDoneTour = async () => {
      await handleTourApi(false, 'done');
      setIsDropdownVisible(false);
      setIsDropdownControlledByTour(false);
      setIsDropdownControlledByTour1(false);
      startTour.destroy();
    };

    const handleSkipTour = () => {
      setIsDropdownVisibleInsights(false);
      setIsDropdownControlledByTour(false);
      setIsDropdownControlledByTour1(true);
      setIsDropdownVisible(true);
      setTimeout(() => {
        startTour.moveTo(7);
      }, 200);
    };

    const startTour = driver({
      steps: [
        {
          element: '#step1',
          popover: {
            title: '',
            description: 'Gain insights into the performance of Shopify apps over a specific time period.',
            side: 'bottom',
            align: 'start',
            onNextClick: () => {
              setIsDropdownControlledByTour(true);
              setIsDropdownVisibleInsights(true);
              setTimeout(() => {
                startTour.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '#step2',
          popover: {
            title: '',
            description: 'Overview of developer performance, comparing active versus inactive developers.',
            side: 'left',
            align: 'start',
            onNextClick: () => {
              setIsDropdownControlledByTour(true);
              setIsDropdownVisibleInsights(true);
              setTimeout(() => {
                startTour.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '#step3',
          popover: {
            title: '',
            description:
              'Gain insights from reviews by location, competitors, category, and even those that have been deleted.',
            side: 'left',
            align: 'start',
            onNextClick: () => {
              setIsDropdownControlledByTour(false);
              setIsDropdownControlledByTour1(true);
              setIsDropdownVisibleInsights(false);
              setIsDropdownVisible(true);
              setTimeout(() => {
                startTour.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '#step4',
          popover: {
            title: '',
            description: 'Access data management',
            side: 'left',
            align: 'start',
            onNextClick: () => {
              setIsDropdownControlledByTour1(false);
              setIsDropdownVisible(false);
              setTimeout(() => {
                startTour.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '#step5',
          popover: {
            title: '',
            description: 'Quickly find and access applications by entering their name or relevant keywords.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#step6',
          popover: {
            title: '',
            description:
              "Add your apps and start tracking your performance. Compare your app with competitor's app too!",
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#step7',
          popover: {
            title: '',
            description: 'Add app and start comparing between them to get insights.',
            side: 'bottom',
            align: 'start',
            onNextClick: () => {
              setIsDropdownControlledByTour1(true);
              setIsDropdownVisible(true);
              setTimeout(() => {
                startTour.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '#step8',
          popover: {
            title: '',
            description: "You can always see the guide to use Let's Metrix here",
            side: 'left',
            align: 'center',
            onNextClick: handleDoneTour,
          },
        },
      ],
      showProgress: true,
      smoothScroll: true,
      allowClose: false,
      prevBtnText: 'Skip tour',
      popoverClass: 'driverjs-theme',
      onPrevClick: handleSkipTour,
      onPopoverRender: (popover, { state }) => {
        const prevButton = popover.previousButton;
        const nextButton = popover.nextButton;
        const currentStep = state.activeIndex;

        prevButton.classList.add('skip-tour-btn');

        if (currentStep === 0) {
          prevButton.style.visibility = 'hidden';
        } else {
          prevButton.style.visibility = 'visible';
        }

        if (currentStep === 7) {
          prevButton.style.display = 'none';
        } else {
          prevButton.style.display = '';
        }

        if (currentStep >= 0 && currentStep <= 2) {
          nextButton.textContent = 'Next';
        } else if (currentStep >= 3 && currentStep <= 6) {
          nextButton.textContent = 'Got it!';
        } else if (currentStep === 7) {
          nextButton.textContent = 'Done';
        }
      },
    });

    startTour.drive();
    return () => {
      startTour.destroy();
    };
  }, [setIsDropdownVisible, setIsDropdownVisibleInsights]);

  return null;
}
