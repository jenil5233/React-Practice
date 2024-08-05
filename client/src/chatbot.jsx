import React from 'react';
import Chatbot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const theme = {
  background: '#f5f8fb',
  headerBgColor: '#4a90e2',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#4a90e2',
  botFontColor: '#fff',
  userBubbleColor: '#e5e5ea',
  userFontColor: '#4a4a4a',
  floating: false,
};

const MyChatbot = ({ isVisible = false, onClose = () => {} }) => {
    const steps = [
        {
          id: '1',
          message: 'Hello! I’m here to assist you with our subscription plans. May I know your name?',
          trigger: 'name',
        },
        {
          id: 'name',
          user: true,
          trigger: '2',
        },
        {
          id: '2',
          message: 'Nice to meet you, {previousValue}! Are you interested in learning about our subscription plans?',
          trigger: 'subscription_interest',
        },
        {
          id: 'subscription_interest',
          options: [
            { value: 'yes', label: 'Yes, tell me more', trigger: 'subscription_options' },
            { value: 'no', label: 'No, thank you', trigger: 'end' },
          ],
        },
        {
          id: 'subscription_options',
          message: 'We offer several subscription plans to suit your needs. Here’s a brief overview:\n\n- **Basic Plan**: $10/month - Access to all basic features.\n- **Pro Plan**: $25/month - Includes advanced features and priority support.\n- **Enterprise Plan**: Custom pricing - Tailored solutions for large organizations.\n\nWhich plan would you like more information about?',
          trigger: 'plan_selection',
        },
        {
          id: 'plan_selection',
          options: [
            { value: 'basic', label: 'Basic Plan', trigger: 'basic_plan_info' },
            { value: 'pro', label: 'Pro Plan', trigger: 'pro_plan_info' },
            { value: 'enterprise', label: 'Enterprise Plan', trigger: 'enterprise_plan_info' },
          ],
        },
        {
          id: 'basic_plan_info',
          message: 'The Basic Plan offers essential features for $10/month. It includes [list of features].\nWould you like to proceed with this plan or know more about the other options?',
          trigger: 'plan_follow_up',
        },
        {
          id: 'pro_plan_info',
          message: 'The Pro Plan, at $25/month, includes advanced features and priority support. It also includes [list of additional features].\nWould you like to proceed with this plan or know more about the other options?',
          trigger: 'plan_follow_up',
        },
        {
          id: 'enterprise_plan_info',
          message: 'Our Enterprise Plan is customized to fit your organization’s needs and pricing is tailored accordingly. It includes [list of enterprise features].\nWould you like to discuss this plan further or explore the other options?',
          trigger: 'plan_follow_up',
        },
        {
          id: 'plan_follow_up',
          options: [
            { value: 'proceed', label: 'Proceed with this plan', trigger: 'collect_details' },
            { value: 'more_info', label: 'Get more information', trigger: 'subscription_options' },
            { value: 'end', label: 'No, thank you', trigger: 'end' },
          ],
        },
        {
          id: 'collect_details',
          message: 'Great! To proceed, I need some details from you. Please provide your email address.',
          trigger: 'email',
        },
        {
          id: 'email',
          user: true,
          trigger: 'confirm_email',
        },
        {
          id: 'confirm_email',
          message: 'Thank you! We have received your email ({previousValue}). Our team will get in touch with you soon to complete the subscription process.',
          trigger: 'end',
        },
        {
          id: 'end',
          message: 'Thank you for chatting with us! Have a good day.',
          end: true,
        },
      ];

  const handleEnd = () => {
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return isVisible ? (
    <div className="chatbot-popup">
      <ThemeProvider theme={theme}>
        <Chatbot steps={steps} handleEnd={handleEnd} />
      </ThemeProvider>
    </div>
  ) : null;
};

export default MyChatbot;
