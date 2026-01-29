'use client'

import { useState, useEffect } from 'react'
import {
  Box, Button, Container, Flex, Heading, Input, Text, Badge,
  VStack, HStack, useToast, Card, CardBody, Step, StepIcon,
  StepIndicator, StepStatus, StepTitle, StepSeparator, Stepper
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { createOrder, getOrderStatus } from './api'

// Animations
const MotionBox = motion(Box)

export default function OrderSagaDashboard() {
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [status, setStatus] = useState('IDLE') // IDLE, PENDING, CONFIRMED, CANCELLED

  // Form Inputs
  const [price, setPrice] = useState(50) // Default 50 (Success), >100 will fail
  const [item, setItem] = useState('MacBook Pro')

  const toast = useToast()

  // 1. Handle Buy Button
  const handleBuy = async () => {
    setLoading(true)
    setStatus('PENDING')
    setOrderId(null)

    try {
      const data = await createOrder({ userId: 'user_123', item, price })
      setOrderId(data.order.id)

      toast({
        title: 'Order Placed',
        description: `Order ID: ${data.order.id.slice(0, 8)}...`,
        status: 'info',
        duration: 2000,
      })
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  // 2. Polling Logic (The "Real-Time" feel)
  useEffect(() => {
    if (!orderId || status === 'CONFIRMED' || status === 'CANCELLED') return;

    const interval = setInterval(async () => {
      const data = await getOrderStatus(orderId);
      setStatus(data.status);

      // Stop polling if final state reached
      if (data.status === 'CONFIRMED' || data.status === 'CANCELLED') {
        setLoading(false);
        toast({
          title: data.status === 'CONFIRMED' ? 'Success!' : 'Transaction Failed',
          description: data.status === 'CONFIRMED'
            ? 'Inventory Reserved & Payment Charged'
            : 'Saga Rollback Triggered (Refunded)',
          status: data.status === 'CONFIRMED' ? 'success' : 'error',
          duration: 5000,
        })
      }
    }, 1000); // Check every 1 second

    return () => clearInterval(interval);
  }, [orderId, status, toast]);

  // Visual Steps for the Stepper
  const getStepIndex = () => {
    if (status === 'IDLE') return 0;
    if (status === 'PENDING') return 1;
    if (status === 'CONFIRMED') return 3;
    if (status === 'CANCELLED') return 3; // Finished, but failed
    return 0;
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">

        {/* Header */}
        <Box textAlign="center">
          <Heading
            bgGradient='linear(to-r, cyan.400, blue.500, purple.600)'
            bgClip='text'
            fontWeight='extrabold'
            size="2xl"
          >
            OrderSaga
          </Heading>
          <Text color="gray.400" mt={2}>
            Distributed Transaction Visualization (Saga Pattern)
          </Text>
        </Box>

        {/* Control Panel */}
        <Card bg="gray.800" borderColor="gray.700" borderWidth="1px">
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={4}>
                <Box w="full">
                  <Text mb={1} fontSize="sm" color="gray.400">Item Name</Text>
                  <Input value={item} onChange={(e) => setItem(e.target.value)} />
                </Box>
                <Box w="full">
                  <Text mb={1} fontSize="sm" color="gray.400">Price ($)</Text>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    borderColor={price > 100 ? 'red.500' : 'green.500'}
                  />
                  <Text fontSize="xs" color={price > 100 ? 'red.400' : 'green.400'}>
                    {price > 100 ? 'Will Fail (Insufficient Funds)' : 'Will Succeed'}
                  </Text>
                </Box>
              </HStack>

              <Button
                w="full"
                colorScheme={price > 100 ? 'red' : 'blue'}
                size="lg"
                onClick={handleBuy}
                isLoading={loading}
                loadingText="Processing Saga..."
              >
                {price > 100 ? 'Simulate Failure Scenario' : 'Place Order'}
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Status Display */}
        {orderId && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            bg="gray.900"
            p={6}
            borderRadius="md"
          >
            <Heading size="md" mb={6} textAlign="center">
              Transaction Status: <Badge fontSize="0.8em" colorScheme={status === 'CONFIRMED' ? 'green' : status === 'CANCELLED' ? 'red' : 'yellow'}>{status}</Badge>
            </Heading>

            {/* The Visual Saga Flow */}
            <Stepper size='lg' index={getStepIndex()} colorScheme={status === 'CANCELLED' ? 'red' : 'green'}>
              <Step>
                <StepIndicator><StepStatus complete={<StepIcon />} incomplete={<StepIcon />} active={<StepIcon />} /></StepIndicator>
                <Box flexShrink='0'><StepTitle>Order Created</StepTitle></Box>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator><StepStatus complete={<StepIcon />} incomplete={<StepIcon />} active={<StepIcon />} /></StepIndicator>
                <Box flexShrink='0'><StepTitle>Inventory Reserved</StepTitle></Box>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator><StepStatus complete={<StepIcon />} incomplete={<StepIcon />} active={<StepIcon />} /></StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle>
                    {status === 'CANCELLED' ? 'Payment Failed' : 'Payment Charged'}
                  </StepTitle>
                </Box>
              </Step>
            </Stepper>

            {status === 'CANCELLED' && (
              <Box mt={6} p={3} bg="red.900" borderRadius="md" textAlign="center">
                <Text color="red.200" fontWeight="bold">⚠️ Saga Rollback Triggered</Text>
                <Text fontSize="sm" color="red.200">Inventory was reserved, then released.</Text>
              </Box>
            )}

          </MotionBox>
        )}
      </VStack>
    </Container>
  )
}