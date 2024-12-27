import Auth from '@/utils/store/Authentication';
import { message } from "antd";
import { useEffect, useState } from "react";
import PricingApiService from '@/api-services/api/PricingApiService';
import { Paths } from '@/router';

const callbackUrl = process.env.REACT_APP_RETURN_URL ?? 'https://letsmetrix.com'
export const usePricing = () => {
    const [loading, setLoading] = useState('')
    const [loadingPlan, setLoadingPlan] = useState(false)
    const [subscription, setSubscription] = useState()
    const [products, setProducts] = useState()
    const [plans, setPlans] = useState([])
    const isAuth = Auth.isAuthenticated()
    const currentUN = Auth.getCurrentUserName()

    /**
     * Có các loại sau
     * TRIAL = 'TRIAL', =>  khi mới tạo tài khoản sẽ có cái này
     * STANDARD = 'STANDARD'
     * PRO = 'PRO',
     * UNLIMITED = 'UNLIMITED',
     * Interface input: 
     * * subscriptionType
     * * period: mặc đinh là 1, sau có thể mở rộng theo nhiều tháng
     * * returnUrl: callback khi payment thành công
     * * cancelUrl: cancelUrl khi payment ngừng payment
     */
    const onHandleSubcription = async (values) => {
        //- Nếu chưa đăng nhập thì navigate vào màn đăng nhập
        if (!currentUN && !isAuth) {
            window.location.href = `/auth${Paths.LoginApp}`
            return
        }

        setLoading(values.subscriptionType)
        const returnUrl = `${callbackUrl}/success`
        const cancelUrl = `${callbackUrl}`
        try {
            if (values && values.subscriptionType) {
                const data = {
                    subscriptionType: values.subscriptionType,
                    period: 1,
                    returnUrl,
                    cancelUrl,
                };
                const result = await PricingApiService.createSubscription(data);
                if (result && result.code === 0) {
                    //- Redirect sang trang cổng thanh toán
                    const callbackLink = result.data.paymentLink
                    const approveLink = callbackLink.find(cb => cb.rel == 'approve')
                    if (approveLink) window.location.href = approveLink.href
                    else message.error('Subscription error');
                } else {
                    message.error('Subscription error');
                }
            }
        } catch (error) {
            message.error('Subscription error');
        } finally {
            setLoading('')
        }
    };


    /**
     * Lấy trạng thái subscription của user hiện tại
     * @returns 
     */
    const onHandleGetCurrentSubscription = async () => {
        console.log("[onHandleGetCurrentSubscription] START", currentUN, isAuth)
        if (!currentUN || !isAuth) return;
        try {
            const result = await PricingApiService.getCurrentSubcription();
            console.log("[onHandleGetCurrentSubscription] RESPONSE", result)
            if (result && result.code === 0) {
                setSubscription(result.data)
                Auth.setCurrentSubscription(result.data.subscriptionType)
            } else {
                setSubscription({})
            }
        } catch (error) {
            setSubscription({})
        }
    }


    /**
     * Lấy danh sách product hiện tại
     * @returns 
     */
    const onGetSubscriptionProducts = async () => {
        setLoadingPlan(true)
        try {
            const result = await PricingApiService.getSubscriptionProducts();
            console.log("[onHandleGetSubscription] RESPONSE", result)
            if (result && result.code === 0) {
                setPlans(result.data)
            } else {
                setPlans([])
            }
        } catch (error) {
            setPlans([])
        } finally {
            setLoadingPlan(false)
        }
    }



    /**
     * Nếu đang ở gói cao thì k cho mua gois thâp hơn
     * Chỉ được nâng cấp gói cao hơn
     */
    const onHandleDisableSubscription = () => {
        const subscriptionType = subscription?.subscriptionType
        if (!subscriptionType) return ['STANDARD', 'PRO', 'UNLIMITED']
        if (subscriptionType == 'TRIAL' || subscriptionType == 'EXPIRED') return ['STANDARD', 'PRO', 'UNLIMITED']
        if (subscriptionType == 'STANDARD') return ['PRO', 'UNLIMITED']
        if (subscriptionType == 'PRO') return ['UNLIMITED']
        if (subscriptionType == 'UNLIMITED') return []
    }

    /**
     * Khi bắt đầu init
     */
    useEffect(() => {
        onGetSubscriptionProducts();
        onHandleGetCurrentSubscription()
    }, [])

    return {
        loading,
        subscription,
        plans,
        loadingPlan,
        onHandleSubcription,
        onHandleDisableSubscription
    }
}