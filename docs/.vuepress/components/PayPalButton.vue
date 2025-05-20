<template>
  <div>
    <div id="paypal-container-XSJ7EJLJ2ZCSQ"></div>
  </div>
</template>

<script>
export default {
  name: 'PayPalButton',
  mounted() {
    // 动态加载PayPal SDK脚本
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAAvdXsAvrvV5ErbCtq_mCSWUKf8BHdlFjjSWisThvymw6RVPB4GOsO88qEKdJaEEcqs_LnD2sdm-Mm_cM&components=hosted-buttons&disable-funding=venmo&currency=USD';
    script.addEventListener('load', () => {
      // 脚本加载完成后初始化PayPal按钮
      window.paypal.HostedButtons({
        hostedButtonId: "XSJ7EJLJ2ZCSQ",
      }).render("#paypal-container-XSJ7EJLJ2ZCSQ");
    });
    document.body.appendChild(script);
  }
}
</script>
